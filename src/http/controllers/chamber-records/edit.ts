import { RecordsNotExistsError } from '@/use-cases/errors/records/records-not-exists'
import { RecordsAlreadyExistsError } from '@/use-cases/errors/records/record-already-exists'
import { makeEditUseCase } from '@/use-cases/factories/chamber-records/make-edit-use-case'
import { error } from 'console'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  // Definindo o esquema de validação para os parametros
  const editChamberRecordParamsSchema = z.object({
    chamberId: z.string().uuid(),
  })

  // Definindo o esquema de validação para os parametros
  const editChamberRecordBodySchema = z.object({
    data: z.object({
      year: z.coerce.number().min(1974).max(new Date().getFullYear()),
      month: z.coerce.number().min(1).max(12).optional(),
      contractors: z.number().optional(),
      headcounts: z.number().optional(),
      staffs: z.number().optional(),
      total: z.number().optional(),
    }),
  })

  const { chamberId } = editChamberRecordParamsSchema.parse(request.params)
  const { data } = editChamberRecordBodySchema.parse(request.body)

  try {
    const editChamberRecordUseCase = makeEditUseCase()

    await editChamberRecordUseCase.execute({
      id: chamberId,
      data,
    })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof RecordsAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }
    if (error instanceof RecordsNotExistsError) {
      return reply.status(404).send({ message: error.message })
    }
  }

  throw error
}
