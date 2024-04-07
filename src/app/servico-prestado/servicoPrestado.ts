import { Cliente } from "../clientes/cliente"

export class ServicoPrestado {
    id!: number
    descricao!: string
    valor!: string
    data!: string
    dataCadastro!: string
    idCliente!: number
    cliente!: Cliente
}