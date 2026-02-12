# Storage Module - Cloudflare R2

Módulo para upload e gerenciamento de arquivos de áudio usando Cloudflare R2 (compatível com S3 API).

## Configuração

### 1. Criar bucket no Cloudflare R2

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navegue até R2 Storage
3. Crie um novo bucket: `fluentify-audio`
4. Configure acesso público (opcional) ou use presigned URLs

### 2. Obter credenciais

1. No R2, vá em "Manage R2 API Tokens"
2. Crie um novo token com permissões:
   - Object Read & Write
   - Bucket: `fluentify-audio`
3. Copie:
   - Account ID
   - Access Key ID
   - Secret Access Key

### 3. Configurar variáveis de ambiente

```env
# Cloudflare R2
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=fluentify-audio
R2_PUBLIC_URL=https://your-bucket.r2.dev  # Optional: se usar domínio público
```

## Endpoints

### Upload de áudio

```bash
POST /storage/audio
Content-Type: multipart/form-data

Headers:
  Authorization: Bearer <token>

Body (form-data):
  file: <audio-file>
  conversationId: <uuid>
  fileName: <original-name>

Response:
{
  "url": "https://...",
  "key": "audio/{conversationId}/{timestamp}-{fileName}",
  "bucket": "fluentify-audio"
}
```

### Obter URL presigned

```bash
POST /storage/presigned-url
Content-Type: application/json

Headers:
  Authorization: Bearer <token>

Body:
{
  "key": "audio/{conversationId}/{timestamp}-{fileName}"
}

Response:
{
  "url": "https://...?X-Amz-Signature=..."
}
```

### Deletar áudio

```bash
DELETE /storage/audio/:key

Headers:
  Authorization: Bearer <token>

Response: 204 No Content
```

## Validações

### Formatos suportados
- MP3 (audio/mpeg)
- WAV (audio/wav)
- OGG (audio/ogg)
- WebM (audio/webm)
- M4A (audio/mp4)

### Limites
- Tamanho máximo: 10MB
- Nome do arquivo será sanitizado (remove caracteres especiais)

## Estrutura de armazenamento

```
fluentify-audio/
└── audio/
    └── {conversationId}/
        ├── {timestamp}-recording1.mp3
        ├── {timestamp}-recording2.wav
        └── ...
```

## Exemplo de uso no código

```typescript
import { StorageService } from './storage.service';

// Upload
const result = await storageService.uploadAudio(
  buffer,
  conversationId,
  'recording.mp3'
);
// Returns: { url, key, bucket }

// Obter URL
const url = await storageService.getPresignedUrl(key, 3600); // 1h expiry

// Deletar
await storageService.deleteAudio(key);
```

## Custos Cloudflare R2

**Free Tier:**
- 10 GB de armazenamento/mês
- 1 milhão de leituras/mês
- 1 milhão de escritas/mês
- Sem egress (saída de dados) cobrado

**Preços após free tier:**
- Storage: $0.015/GB/mês
- Classe A (write): $4.50/milhão
- Classe B (read): $0.36/milhão

Para ~500 usuários com média de 10 conversas/mês:
- 5000 conversas × 2 áudios × 1MB ≈ 10GB/mês
- **Custo: R$ 0** (dentro do free tier)

## Integração com Conversation Module

O StorageService é exportado pelo StorageModule e pode ser injetado em outros módulos:

```typescript
@Module({
  imports: [StorageModule],
  // ...
})
export class ConversationModule {}

// No service:
constructor(private storageService: StorageService) {}

// Upload áudio da mensagem:
const { url } = await this.storageService.uploadAudio(
  audioBuffer,
  conversationId,
  'user-message.mp3'
);

// Salvar no banco:
await this.prisma.message.create({
  data: {
    conversationId,
    role: 'USER',
    content: transcription,
    audioUrl: url,
  },
});
```

## Troubleshooting

### Erro: "STORAGE_ERROR"
- Verifique se as credenciais R2 estão corretas
- Confirme que o bucket existe
- Verifique permissões do token R2

### Erro: "FILE_TOO_LARGE"
- Arquivo excede 10MB
- Ajustar maxSize em storage.service.ts se necessário

### Erro: "INVALID_AUDIO_FORMAT"
- Formato não suportado
- Adicionar extensão em validateAudioFile() se necessário

## Segurança

- ✅ Autenticação obrigatória (JWT)
- ✅ Validação de formato e tamanho
- ✅ Sanitização de nomes de arquivo
- ✅ Presigned URLs com expiração
- ✅ CORS configurável via R2 settings
- ✅ Organização por conversationId (isolamento)

## TODO Phase 2

- [ ] Integrar com Groq Whisper para transcrição automática
- [ ] Adicionar suporte para streaming de áudio
- [ ] Implementar CDN (Cloudflare Workers) para otimização
- [ ] Adicionar limpeza automática de áudios antigos (lifecycle policies)
- [ ] Implementar compressão de áudio antes do upload
