
## Requisitos Funcionais
- [X] Deve ser possivel cadastrar uma camara como administrador;
- [X] Deve ser possivel listar cidades como administrador;
- [X] Deve ser possivel editar cidade e estado de uma camara como administrador;
- [X] Deve ser possivel apagar camara como administrador;
- [X] Deve ser possivel cadastrar usuarios como administrador;
- [X] Deve ser possivel editar informacoes de usuario como administrador;
- [X] Deve ser possivel permitir quem pode usar a plataforma como administrador;
- [ ] Deve ser possivel apagar usuarios como administrador;
- [X] Deve ser possivel buscar usuarios pela cidade como administrador;
- [X] Deve ser possivel buscar usuarios pelo nome como administrador;
- [X] Deve ser possivel buscar usuario pelo cpf como administrador;
- [X] Deve ser possivel buscar informacoes de um usuario como administrador;
- [X] Deve ser possivel visualizar demonstrativos como vereador(a);
- [ ] Deve ser possivel cadastrar demonstrativos como secreatario(a);
- [ ] Deve ser possivel editar demonstrativos como secreatario(a);
- [ ] Deve ser possivel apagar demonstrativos como secreatario(a);
- [ ] Deve ser possivel comparar demonstrativos

## Regras de negocio

- [X] O usuario deve estar associado a uma camara;
- [X] Nao pode realizar cadastro com um e-mail e cpf duplicado;
- [ ] Nao pode ter cidade com o mesmo nome no mesmo estado;
- [X] Usuarios so pode ser cadastrado por administradores;

## Requisitos nao funcionais

- [X] A senha do usuario precisa estar criptografada;
- [X] Os dados da aplicacao precisa estar persistido em banco PostgresSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 itens por pagina;
- [X] O usuario deve ser identifcado por um JWT

## TODOS

- [ ] Adicionar erros certos
- [ ] Aumentar tempo do refresh token