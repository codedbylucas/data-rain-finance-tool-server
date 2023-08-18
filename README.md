# Data Rain Finance Tool Server

Bem-vindo ao Projeto de Integração Back-end da dataRain Consulting
Este repositório abriga o resultado de um projeto desenvolvido como freelancer para a dataRain Consulting. O principal propósito deste projeto é aprimorar a comunicação e a eficiência entre as diversas equipes internas da empresa, ao mesmo tempo em que otimiza o processo de elaboração de orçamentos.

## Principais Objetivos:

**Facilitação da Comunicação Interdepartamental**: O foco central deste projeto é promover uma comunicação mais fluida e colaborativa entre as equipes da dataRain Consulting. Isso é alcançado através de uma API robusta que permite o compartilhamento de informações e dados essenciais entre diferentes áreas, contribuindo para uma visão unificada dos projetos em andamento.

**Agilização do Processo de Orçamentação**: O projeto visa simplificar e acelerar a geração de orçamentos para projetos em nuvem. Ao fornecer uma estimativa preliminar dos custos envolvidos, permite aos clientes da dataRain ter uma visão antecipada dos investimentos necessários para a implementação de suas soluções em nuvem. Além disso, a plataforma oferece a flexibilidade de ajustar os valores conforme as necessidades e requisitos específicos de cada projeto.

**Gestão Eficiente de Horas Trabalhadas**: A API oferece aos profissionais da dataRain uma maneira conveniente de registrar suas horas de trabalho. Além disso, possibilita a solicitação de autorização para horas extras junto aos gestores. Ao incluir detalhes como motivo e data planejada para as horas extras, o sistema garante um controle rigoroso e transparente das horas trabalhadas, promovendo uma gestão mais precisa e efetiva.



## Pré-requisitos

É imprescindível que você tenha instalado em seu computador o NodeJs e o PostgreSQL para que possa executar e testar este projeto.

- **Node** - [https://nodejs.org/en/download/](https://nodejs.org/pt-br/download/)
- **PostgreSQL** - [https://www.postgresql.org/download/](https://www.npmjs.com/package/download)

## Instalação

 Exemplo:

 Clone esse projeto em seu computador com o comando:

 ```
 	git clone [https://github.com/codedbylucas/data-rain-finance-tool-server.git]
 ```

 Acesse a pasta do projeto seu terminal:

 ```
 	cd [data-rain-finance-tool-server]
 ```

 Já pasta da aplicação em seu terminal, digite o seguinte comando:

 ```
 	npm install
 ```

 Crie um arquivo '.env' e preencha com as variáveis do arquivo '.env.example'

 ```
 DATABASE_URL="postgresql://[nome do usuário no postgres]:[senha do usuário]@localhost:[porta em que seu banco de dados está rodando, ex: '5432']/finance-tool"
 ```

 ```
 JWT_SECRET="klsA92n9LWS9bfjs128$%"
 ```

 ```
 CRYPTR_SECRET_KEY="38Lns82hDmA3rac$"
 ```

Variaveis como:
  * MAIL_PASS=
  * MAIL_HOST=
  * MAIL_USER=
  * MAIL_PORT=

São necessárias caso queira testar o envio de email, porém só podem ser obtida criando um email como host, aconselho que use o gmail.

## Execução

Para instalar as dependências, execute o comando:

```
  npm install
```

Para criar as tabelas no banco de dados execute o comando:

```
  npx prisma db push
```

Após ter configurado o projeto e ter aguardado a instalação das dependências de desenvolvimento, execute o comando:

```
  npm run start
```

 Caso queira que o projeto rode automaticamente após fazer alguma alteração no código execute o comando:

```
  npm run start:dev
```

 A aplicação estará disponível para visualização em seu navegador, caso isso não aconteça automaticamente abre o navegador no seguinte endereço: _localhost:3333/api_


## Stacks Utilizadas

- NestJs, TypeScript, JavaScript, Express, Swagger, Bcrypt, JWT, Nodemailer, Socket.io, cryptr, Prisma e PostgreSQL



## Autor

- **Lucas Marques** - Desenvolvedor - [Github](https://github.com/codedbylucas) | [Linkedin](https://www.linkedin.com/in/codedbylucas/)

## Licença

General Public License [GNU](https://www.gnu.org/licenses/gpl-3.0.html).
