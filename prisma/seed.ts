import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const citiesToCreate = [
    { id: 'clrpi8rah000008l70mmo3uay', name: 'sacramento', state: 'mg' },
    { name: 'uberaba', state: 'mg' },
    { name: 'uberlandia', state: 'mg' },
    { name: 'conquista', state: 'mg' },
    { name: 'araxa', state: 'mg' },
    { name: 'betim', state: 'mg' },
    { name: 'ouro preto', state: 'mg' },
    { name: 'belo horizonte', state: 'mg' },
    { name: 'muriae', state: 'mg' },
    { name: 'contagem', state: 'mg' },
    { name: 'ribeirao das neves', state: 'mg' },
    { name: 'araguari', state: 'mg' },
  ]

  for (const cityData of citiesToCreate) {
    await prisma.city.create({
      data: cityData,
    })
  }

  await prisma.user.createMany({
    data: [
      {
        name: 'Eduardo Rodrigues',
        email: 'eduardo@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '08636379652',
        role: 'ADMIN',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Marcos Vinicius Benedito Assis',
        email: 'marcos@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '91868639401',
        role: 'SECRETARY',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Natália Vitória da Mata',
        email: 'natalia@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '08426678572',
        role: 'SECRETARY',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Benedita Patrícia Melissa Araújo',
        email: 'benedita@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '31831693127',
        role: 'SECRETARY',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Alícia Malu Duarte',
        email: 'alicia@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '57314043566',
        role: 'SECRETARY',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Luan Marcos Vinicius Carlos Eduardo Gonçalves',
        email: 'luan@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '38394936504',
        role: 'SECRETARY',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Isabelly Sandra Flávia Castro',
        email: 'isabelly@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '21693177757',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Sueli Marlene Raimunda Aparício',
        email: 'sueli@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '81760990744',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Aparecida Rita Gabrielly das Neves',
        email: 'aparecida@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '49046207129',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Benedita Patrícia Melissa Araújo',
        email: 'benedita@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '31831693127',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Sebastião Nicolas Nogueira',
        email: 'sebastiao@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '63058708378',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Paulo Erick Pereira',
        email: 'paulo@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '00445732601',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Maya Raquel Fátima da Costa',
        email: 'maya@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '75527010302',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Leandro Enzo Henrique Brito',
        email: 'leandro@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '88451840132',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Elias Otávio da Rocha',
        email: 'elias@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '58671865479',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Severino Pedro Caio da Rosa',
        email: 'severino@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '55433739376',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Breno Heitor Freitas',
        email: 'breno@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '35545020730',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Luiz Nelson Santos',
        email: 'luiz@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '67552491736',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Nelson Murilo Peixoto',
        email: 'nelson@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '69166893402',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
      {
        name: 'Bruno Calebe Arthur Assunção',
        email: 'bruno@prisma.io',
        password:
          '$2y$06$oHpObl5YZN19WZ9mNmPFXee9zhXHFgRCG.Lcyoa2v4/rsN6/atJPm',
        cpf: '00390422517',
        city_id: 'clrpi8rah000008l70mmo3uay',
      },
    ],
  })
}
