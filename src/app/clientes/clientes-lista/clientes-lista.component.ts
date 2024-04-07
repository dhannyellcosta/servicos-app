import { ClientesService } from './../../clientes.service';
import { Cliente } from './../cliente';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css']
})
export class ClientesListaComponent implements OnInit {

  clientes: Cliente[] = []
  clienteSelecionado!: Cliente
  mensagemSuccess: string | null = null
  mensagemArlet: string | null = null
  mensagemError: string | null = null

  paginaAtual: number = 1
  itensPorPagina: number = 7

  nome: string = ""
  cpf: string = ""

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar() {
    this.clientesService.getClientes(this.nome, this.cpf)
      .subscribe(
        response => {
          this.clientes = response
          if (this.clientes.length <= 0) {
            this.mensagemArlet = 'Nenhum registro encontrado.'
            this.mensagemError = null
            this.mensagemSuccess = null
          }
        },
        errorResponse => {
          this.exibirMensagemError(errorResponse)
        })
  }

  novoCadastro() {
    this.router.navigate(['/clientes/form'])
  }

  preparaDelecao(cliente: Cliente) {
    this.clienteSelecionado = cliente
  }

  deletarCliente() {
    this.clientesService.deletar(this.clienteSelecionado).subscribe(
      response => {
        this.exibirMensagemSuccess()
        this.ngOnInit()
      },
      errorResponse => {
        this.mensagemSuccess = null
        this.mensagemError = errorResponse.error.errors
      })
  }

  exibirMensagemSuccess() {
    this.mensagemError = null
    this.mensagemSuccess = 'Cliente deletado com sucesso.'
  }

  exibirMensagemError(errorResponse: any) {
    this.mensagemSuccess = null
    this.mensagemError = errorResponse.error.errors
  }

  fecharAlert() {
    this.mensagemError = null
    this.mensagemSuccess = null
  }

  getItensPagina(): any[] {
    const startIndex = (this.paginaAtual - 1) * this.itensPorPagina
    return this.clientes.slice(startIndex, startIndex + this.itensPorPagina)
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas()) {
      this.paginaAtual++
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.clientes.length / this.itensPorPagina)
  }
}
