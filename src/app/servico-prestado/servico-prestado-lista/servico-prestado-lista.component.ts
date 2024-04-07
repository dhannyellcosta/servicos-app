import { Router } from '@angular/router';
import { ServicoPrestadoService } from './../../servico-prestado.service';
import { ServicoPrestadoBusca } from './servicoPrestadoBusca';
import { Component, OnInit } from '@angular/core';
import { ServicoPrestado } from '../servicoPrestado';

@Component({
  selector: 'app-servico-prestado-lista',
  templateUrl: './servico-prestado-lista.component.html',
  styleUrls: ['./servico-prestado-lista.component.css']
})
export class ServicoPrestadoListaComponent implements OnInit {

  nome!: string
  mes!: number
  meses = [{ id: '1', nome: 'JANEIRO' }, { id: '2', nome: 'FEVEREIRO' },
  { id: '3', nome: 'MARÇO' }, { id: '4', nome: 'ABRIL' },
  { id: '5', nome: 'MAIO' }, { id: '6', nome: 'JUNHO' },
  { id: '7', nome: 'JULHO' }, { id: '8', nome: 'AGOSTO' },
  { id: '9', nome: 'SETEMBRO' }, { id: '10', nome: 'OUTUBRO' },
  { id: '11', nome: 'NOVEMBRO' }, { id: '12', nome: 'DEZEMBRO' }]

  lista: ServicoPrestadoBusca[] = []
  mensagemSuccess: string | null = null
  mensagemAlert: string | null = null
  mensagemError: string | null = null
  servicoSelecionado!: ServicoPrestado
  paginaAtual: number = 1
  itensPorPagina: number = 7

  constructor(private service: ServicoPrestadoService, private router: Router) { }

  ngOnInit(): void {
    this.pesquisar()
  }

  pesquisar() {
    this.service.getServicoPrestado(this.nome, this.mes)
      .subscribe(
        response => {
          this.lista = response
          if (this.lista.length <= 0) {
            this.mensagemAlert = 'Nenhum registro encontrado.'
            this.mensagemError = null
            this.mensagemSuccess = null
          }
        },
        errorResponse => {
          this.exibirMensagemError(errorResponse)
        })
  }

  novoCadastro() {
    this.router.navigate(['/servico-prestado/form'])
  }

  preparaDelecao(servico: ServicoPrestado) {
    this.servicoSelecionado = servico
  }

  deletarServico() {
    this.service.deletar(this.servicoSelecionado).subscribe(
      response => {
        this.exibirMensagemSuccess()
        this.ngOnInit()
      },
      errorResponse => {
        this.exibirMensagemError(errorResponse)
      })
  }

  exibirMensagemSuccess() {
    this.mensagemError = null
    this.mensagemSuccess = 'Serviço deletado com sucesso.'
  }

  exibirMensagemError(errorResponse: any) {
    this.mensagemSuccess = null
    this.mensagemError = errorResponse.error.errors
  }

  fecharAlert() {
    this.mensagemSuccess = null
  }

  getItensPagina(): any[] {
    const startIndex = (this.paginaAtual - 1) * this.itensPorPagina
    return this.lista.slice(startIndex, startIndex + this.itensPorPagina)
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
    return Math.ceil(this.lista.length / this.itensPorPagina)
  }

}
