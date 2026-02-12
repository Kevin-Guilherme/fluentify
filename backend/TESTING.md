# Testes Unitários - Backend

## Visão Geral

Testes unitários básicos implementados para os 4 services principais do backend, seguindo o padrão NestJS/Jest.

## Arquivos de Teste

### 1. UserService (`user.service.spec.ts`)
**Métodos testados:**
- `getUserById()` - Buscar usuário por ID
  - ✅ Retorna usuário quando encontrado
  - ✅ Lança BusinessException quando não encontrado

- `getUserStats()` - Estatísticas do usuário
  - ✅ Retorna stats completas com conversas, XP e achievements
  - ✅ Lida com usuário sem conversas

- `updateStreak()` - Atualizar streak
  - ✅ Define streak=1 para primeira atividade
  - ✅ Incrementa streak quando ativo no dia seguinte
  - ✅ Reseta streak quando perdeu um dia

- `getConversationHistory()` - Histórico com paginação
  - ✅ Retorna histórico paginado
  - ✅ Lida com histórico vazio

**Total:** 9 testes

---

### 2. ConversationService (`conversation.service.spec.ts`)
**Métodos testados:**
- `createConversation()` - Criar conversa
  - ✅ Cria conversa com mensagem system inicial
  - ✅ Lança erro quando tópico não existe
  - ✅ Lança erro quando tópico está inativo

- `sendMessage()` - Enviar mensagem
  - ✅ Envia mensagem com sucesso
  - ✅ Lança erro quando conversa já completada

- `completeConversation()` - Finalizar conversa
  - ✅ Completa com feedback e XP
  - ✅ Lança erro quando conversa não encontrada
  - ✅ Lança erro quando já completada

- `listConversations()` - Listar conversas
  - ✅ Lista conversas do usuário
  - ✅ Retorna array vazio quando sem conversas

**Total:** 9 testes

---

### 3. TopicService (`topic.service.spec.ts`)
**Métodos testados:**
- `findAll()` - Listar tópicos
  - ✅ Retorna todos tópicos ativos
  - ✅ Filtra por dificuldade
  - ✅ Retorna array vazio quando sem tópicos

- `findById()` - Buscar tópico
  - ✅ Retorna detalhes do tópico
  - ✅ Inclui count de conversas quando solicitado
  - ✅ Lança erro quando não encontrado
  - ✅ Lança erro quando inativo

- `getRandomTopic()` - Tópico aleatório
  - ✅ Retorna tópico aleatório
  - ✅ Filtra por dificuldade
  - ✅ Lança erro quando sem tópicos

- `create()` - Criar tópico
  - ✅ Cria novo tópico

- `update()` - Atualizar tópico
  - ✅ Atualiza tópico existente

- `delete()` - Deletar tópico (soft delete)
  - ✅ Define isActive=false

**Total:** 12 testes

---

### 4. StorageService (`storage.service.spec.ts`)
**Métodos testados:**
- `uploadAudio()` - Upload de áudio
  - ✅ Faz upload com sucesso
  - ✅ Sanitiza nomes de arquivo
  - ✅ Lança BusinessException em caso de erro

- `getPresignedUrl()` - Gerar URL
  - ✅ Retorna URL para arquivo existente
  - ✅ Lança erro quando arquivo não existe

- `deleteAudio()` - Deletar áudio
  - ✅ Deleta arquivo com sucesso
  - ✅ Remove diretório vazio
  - ✅ Não remove diretório com outros arquivos
  - ✅ Lança erro em caso de falha

- `validateFileSize()` - Validar tamanho
  - ✅ Retorna true para tamanho válido
  - ✅ Retorna false para tamanho excedente
  - ✅ Retorna true para tamanho exato no limite

- `validateAudioFile()` - Validar extensão
  - ✅ Retorna true para extensões válidas (mp3, wav, ogg, webm, m4a)
  - ✅ Retorna false para extensões inválidas
  - ✅ Case insensitive
  - ✅ Retorna false sem extensão

- `listConversationFiles()` - Listar arquivos
  - ✅ Lista arquivos da conversa
  - ✅ Retorna array vazio quando diretório não existe
  - ✅ Retorna array vazio quando sem arquivos

**Total:** 16 testes

---

## Executar Testes

### Todos os testes
```bash
npm test
```

### Testes específicos
```bash
# User Service
npm test -- user.service.spec

# Conversation Service
npm test -- conversation.service.spec

# Topic Service
npm test -- topic.service.spec

# Storage Service
npm test -- storage.service.spec
```

### Com coverage
```bash
npm run test:cov
```

### Watch mode
```bash
npm run test:watch
```

---

## Padrão Utilizado

### Estrutura de Teste
```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    // Setup com mock do PrismaService
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    prisma = module.get(PrismaService);
  });

  describe('methodName', () => {
    it('should do something successfully', async () => {
      // Arrange
      const mockData = { ... };
      prisma.entity.method.mockResolvedValue(mockData);

      // Act
      const result = await service.methodName(params);

      // Assert
      expect(result).toEqual(expected);
    });

    it('should handle error case', async () => {
      // Arrange
      prisma.entity.method.mockResolvedValue(null);

      // Assert
      await expect(service.methodName(params)).rejects.toThrow(BusinessException);
    });
  });
});
```

### Mocks
- **PrismaService**: Mockado com apenas métodos necessários
- **Dados de teste**: Simples e diretos
- **Erros**: BusinessException com MappedsReturnsEnum

### Boas Práticas Aplicadas
✅ Arrange-Act-Assert pattern
✅ Testes independentes (sem side effects)
✅ Mocks simples e focados
✅ Nomes descritivos (should...)
✅ Cobertura de casos de sucesso e erro
✅ Uso de `jest.Mocked<T>` para type safety

### NÃO Fazer
❌ Testes E2E (só unitários)
❌ Factories complexas
❌ Setup/teardown elaborados
❌ Bibliotecas extras
❌ Mocks sofisticados
❌ Coverage obsessivo

---

## Estatísticas

- **Total de arquivos:** 4
- **Total de testes:** ~46
- **Cobertura esperada:** 50-60%
- **Tempo de execução:** <5s

---

## Próximos Passos (Fase 2)

### Testes de Integração
- Auth flow completo
- Groq API integration
- RAG service

### E2E Tests
- Fluxo completo de conversa
- Upload e processamento de áudio

### Coverage
- Aumentar para 70-80% com testes de edge cases
