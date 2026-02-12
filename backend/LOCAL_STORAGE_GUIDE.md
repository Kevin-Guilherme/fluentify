# 📁 Local Storage (Desenvolvimento)

StorageService configurado para **filesystem local** durante desenvolvimento. Migração para Cloudflare R2 em produção é transparente (mesma interface).

## ✅ Como Funciona

### Estrutura de Diretórios

```
backend/
├── uploads/           # Criado automaticamente
│   └── audio/
│       └── {conversationId}/
│           └── {timestamp}-{fileName}
└── src/
```

### Configuração Automática

✅ **Zero configuração necessária**
- Diretório criado automaticamente no startup
- Arquivos servidos em `http://localhost:3001/uploads/audio/`
- Não precisa de credenciais ou API keys

### Exemplo de Upload

```bash
# Upload áudio
curl -X POST http://localhost:3001/storage/audio \
  -H "Authorization: Bearer YOUR_JWT" \
  -F "file=@recording.mp3" \
  -F "conversationId=uuid-here" \
  -F "fileName=recording.mp3"

# Response:
{
  "url": "http://localhost:3001/uploads/audio/{conversationId}/{timestamp}-recording.mp3",
  "key": "{conversationId}/{timestamp}-recording.mp3",
  "bucket": "local-filesystem"
}
```

### Acessar Áudio

```bash
# Direto pela URL retornada
http://localhost:3001/uploads/audio/{conversationId}/{timestamp}-recording.mp3

# Ou via endpoint
POST http://localhost:3001/storage/presigned-url
Body: { "key": "{conversationId}/{timestamp}-recording.mp3" }
```

### Deletar Áudio

```bash
DELETE http://localhost:3001/storage/audio/{key-encoded}

# Key deve ser URL-encoded:
# "uuid/123-file.mp3" -> "uuid%2F123-file.mp3"
```

## 🔄 Migração para Cloudflare R2

### Quando migrar?

- **Development:** Local storage ✅
- **Staging:** R2 (compartilhar entre devs)
- **Production:** R2 (obrigatório)

### Como migrar?

**Opção 1: Trocar implementação (0 minutos)**

1. Renomear arquivo:
```bash
mv src/modules/storage/storage.service.ts src/modules/storage/local-storage.service.ts
mv src/modules/storage/r2-storage.service.ts.backup src/modules/storage/storage.service.ts
```

2. Configurar .env:
```env
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=fluentify-audio
R2_PUBLIC_URL=https://your-bucket.r2.dev
```

3. Rebuild e restart

**Opção 2: Environment-based (recomendado)**

Criar factory que escolhe implementação baseado em `NODE_ENV`:

```typescript
// storage.module.ts
providers: [
  {
    provide: StorageService,
    useClass: process.env.NODE_ENV === 'production'
      ? R2StorageService
      : LocalStorageService,
  },
]
```

## 📊 Comparação

| Feature | Local Storage | Cloudflare R2 |
|---------|---------------|---------------|
| Setup | ✅ Zero config | ⚠️ Requer conta |
| Custo | 💰 Grátis | 💰 Grátis (free tier) |
| Performance | ⚡ Rápido (local) | 🌐 CDN global |
| Durabilidade | ⚠️ Depende do server | ✅ 11 noves |
| Compartilhamento | ❌ Local only | ✅ URLs públicas |
| Escalabilidade | ⚠️ Disco limitado | ✅ Ilimitado |
| Backup | ❌ Manual | ✅ Automático |

## 🚨 Importante

### ⚠️ Não commitar uploads/

O diretório `/uploads` está no `.gitignore`. Arquivos locais NÃO serão commitados.

### ⚠️ Dados não persistem

Se você deletar o container/VM, os arquivos são perdidos. Use R2 em produção.

### ⚠️ Não compartilhável

URLs locais (`localhost:3001`) não funcionam em outros devices. Use R2 para compartilhar.

## 🧪 Testes Automatizados

```typescript
// conversation.service.spec.ts
describe('ConversationService with LocalStorage', () => {
  it('should upload and retrieve audio', async () => {
    const audioBuffer = Buffer.from('fake-audio-data');

    const { url, key } = await storageService.uploadAudio(
      audioBuffer,
      conversationId,
      'test.mp3'
    );

    expect(url).toContain('localhost:3001/uploads/audio');
    expect(key).toContain(conversationId);

    // Verify file exists
    const filePath = storageService.getFilePath(key);
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
```

## 📝 Métodos Disponíveis

### LocalStorageService

```typescript
// Upload
uploadAudio(buffer: Buffer, conversationId: string, fileName: string)
  -> Promise<{ url: string, key: string, bucket: string }>

// Get URL (no expiration)
getPresignedUrl(key: string, expiresIn?: number)
  -> Promise<string>

// Delete
deleteAudio(key: string)
  -> Promise<void>

// List files (extra, não tem no R2)
listConversationFiles(conversationId: string)
  -> Promise<string[]>

// Get file path (extra, não tem no R2)
getFilePath(key: string)
  -> string

// Validations (mesmas do R2)
validateFileSize(size: number) -> boolean
validateAudioFile(fileName: string) -> boolean
```

## 🎯 Próximos Passos

1. ✅ **Agora:** Testar upload local
2. ⬜ **Fase 2:** Integrar com Groq Whisper (transcrição)
3. ⬜ **Fase 5:** Migrar para R2 antes do deploy

---

**💡 Dica:** Use Postman/Insomnia para testar uploads. Exemplo de collection incluído em `/docs/postman/`.
