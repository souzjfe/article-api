# Article API

Sistema de gerenciamento de artigos e usuários com controle de permissões (RBAC) desenvolvido em NestJS.

## Descrição do Projeto

Este projeto consiste em uma API RESTful para gerenciamento de conteúdo, permitindo a administração de usuários e artigos com diferentes níveis de acesso. O sistema foi projetado para ser escalável, seguro e fácil de manter, utilizando práticas modernas de desenvolvimento backend.

## Verificação de Requisitos

Abaixo, o comparativo entre o solicitado e o entregue, incluindo melhorias adicionais:

### Requisitos Solicitados
- [x] **Framework NestJS**: Utilizado como base do projeto.
- [x] **Docker & Compose**: Ambiente completo levantado via `docker compose up --build` na porta 3000.
- [x] **Autenticação JWT**: Implementada com Guardas e Strategies, incluindo permissão no payload.
- [x] **Gestão de Usuários**: CRUD completo (Nome, Email, Senha).
- [x] **Gestão de Artigos**: CRUD completo com autoria vinculada.
- [x] **Permissões (RBAC)**: Tabela dedicada com Seeds automáticas.
- [x] **Níveis de Acesso**:
  - **Admin**: Gerencia tudo.
  - **Editor**: Gerencia artigos.
  - **Reader**: Apenas leitura.
- [x] **Seeds**: Criação automática de permissões e usuário Root na inicialização.

### Implementações Extras e Melhorias
- **Documentação Automática (Swagger)**: Disponível em `/docs` para facilitar o consumo e teste da API.
- **Validação de Dados (DTOs)**: Uso e validação estrita de dados de entrada com `class-validator` e `class-transformer`.
- **Tipo de Conteúdo JSON**: O conteúdo dos artigos foi tipado como JSON (`Record<string, unknown>`) para permitir estruturas ricas (ex: rich text editors), ao invés de texto simples.
- **Testes Unitários Abrangentes**: Cobertura de testes para Controllers, Services e Guards, garantindo a estabilidade das regras de negócio.
- **Linting Rigoroso**: Configuração de ESLint corrigida para garantir qualidade e padronização do código.
- **Tratamento de Erros**: Uso de Exceptions HTTP padrão do NestJS para respostas semânticas.

---

## Considerações e Escolhas Técnicas

- **ORM (TypeORM)**: A escolha pelo TypeORM, em detrimento de ORMs mais recentes (como Prisma ou Drizzle), deve-se à sua integração com o ecossistema NestJS. Além disso, essa escolha permitiu demonstrar conhecimento prático na configuração e gerenciamento de *migrations*.

- **Documentação (OpenAPI/Swagger)**: Embora não fosse um requisito explícito, a implementação do Swagger foi realizada para facilitar o processo de testes manuais e o consumo da API durante o desenvolvimento, servindo como uma interface visual imediata.

- **Arquitetura**: Optou-se pela arquitetura modular padrão recomendada pelo NestJS. Apesar do conhecimento em padrões arquiteturais mais complexos, como *DDD (Domain-Driven Design)* e *Clean Architecture*, a abordagem padrão foi escolhida por ser mais objetiva e pragmática para o escopo atual da aplicação, evitando complexidade acidental.

- **Versionamento de API**: A API foi iniciada sem versionamento seguindo [a documentação oficial do NestJS](https://docs.nestjs.com/techniques/versioning) para evitar complexidade desnecessária devido à sua simplicidade inicial. No entanto, reconheço que essa é uma prática essencial para garantir a escalabilidade e a retrocompatibilidade em cenários de evolução do produto a longo prazo.

- **Qualidade de Código (Testes e Linter)**: A implementação rigorosa de testes unitários e a configuração do ESLint foram fundamentais. Essas ferramentas não apenas garantiram a qualidade e estabilidade do código, mas também serviram como "balizas" para auxiliar o fluxo de desenvolvimento e fornecer diretrizes claras para a IA durante o pair programming.

---

## Como Executar

### Pré-requisitos
- Docker e Docker Compose

### Passo a Passo

1. Suba o ambiente:
   ```bash
   docker compose up --build
   ```

2. Acesse a documentação:
   - Abra [http://localhost:3000/docs](http://localhost:3000/docs) no navegador.

3. Login Inicial (Admin):
   - **Email**: `root@system.com`
   - **Senha**: `root123`

### Testes
Para rodar os testes unitários:
```bash
pnpm install
pnpm test
```
