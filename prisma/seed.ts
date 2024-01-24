import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const citiesToCreate = [
    { name: 'uberaba', state: 'mg' },
    { name: 'uberlandia', state: 'mg' },
  ]

  for (const cityData of citiesToCreate) {
    await prisma.city.create({
      data: cityData,
    })
  }

  // const usersToCreate = [
  //   {
  //     name: 'Eduardo Rodrigues',
  //     email: 'eduardo@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '086.363.796-52',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Marcos Vinicius Benedito Assis',
  //     email: 'marcos@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '918.686.394-01',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Natália Vitória da Mata',
  //     email: 'natalia@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '084.266.785-72',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Benedita Patrícia Melissa Araújo',
  //     email: 'benedita@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '318.316.931-27',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Alícia Malu Duarte',
  //     email: 'alicia@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '573.140.435-66',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Luan Marcos Vinicius Carlos Eduardo Gonçalves',
  //     email: 'luan@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '383.949.365-04',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Isabelly Sandra Flávia Castro',
  //     email: 'isabelly@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '216.931.777-57',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Sueli Marlene Raimunda Aparício',
  //     email: 'sueli@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '817.609.907-44',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Aparecida Rita Gabrielly das Neves',
  //     email: 'aparecida@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '490.462.071-29',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Benedita Patrícia Melissa Araújo',
  //     email: 'benedita@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '318.316.931-27',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Sebastião Nicolas Nogueira',
  //     email: 'sebastiao@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '630.587.083-78',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Paulo Erick Pereira',
  //     email: 'paulo@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '004.457.326-01',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Maya Raquel Fátima da Costa',
  //     email: 'maya@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '755.270.103-02',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Leandro Enzo Henrique Brito',
  //     email: 'leandro@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '884.518.401-32',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Elias Otávio da Rocha',
  //     email: 'elias@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '586.718.654-79',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Severino Pedro Caio da Rosa',
  //     email: 'severino@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '554.337.393-76',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Breno Heitor Freitas',
  //     email: 'breno@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '355.450.207-30',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Luiz Nelson Santos',
  //     email: 'luiz@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '675.524.917-36',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Nelson Murilo Peixoto',
  //     email: 'nelson@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '691.668.934-02',
  //     city_id: sacramento.id,
  //   },
  //   {
  //     name: 'Bruno Calebe Arthur Assunção',
  //     email: 'bruno@prisma.io',
  //     password: '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
  //     cpf: '003.904.225-17',
  //     city_id: sacramento.id,
  //   },
  // ]

  // for (const userData of usersToCreate) {
  //   await prisma.user.create({
  //     data: userData,
  //   })
  // }
}

main()
