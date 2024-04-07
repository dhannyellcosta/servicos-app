import { Params, Router, ActivatedRoute } from '@angular/router';
import { ServicoPrestadoService } from './../../servico-prestado.service';
import { ServicoPrestado } from './../servicoPrestado';
import { ClientesService } from './../../clientes.service';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './../../clientes/cliente';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale, enGbLocale } from 'ngx-bootstrap/locale';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-servico-prestado-form',
  templateUrl: './servico-prestado-form.component.html',
  styleUrls: ['./servico-prestado-form.component.css']
})
export class ServicoPrestadoFormComponent implements OnInit {

  clientes!: Cliente[]
  servico: ServicoPrestado
  mensagemSuccess: string | null = null
  errors: string[] = []
  id!: number

  constructor(
    private localeService: BsLocaleService,
    private datepickerConfig: BsDatepickerConfig,
    private clientesService: ClientesService,
    private service: ServicoPrestadoService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.servico = new ServicoPrestado()
    this.datepickerConfig.containerClass = 'theme-dark-blue'
    ptBrLocale.invalidDate = 'Data inválida'
    defineLocale('pt-br', ptBrLocale)
    this.localeService.use('pt-br')
  }

  ngOnInit(): void {
    this.clientesService.getClientes("", "")
      .subscribe(response => this.clientes = response)

    let params: Observable<Params> = this.activatedRoute.params
    params.subscribe(urlParams => {
      this.id = urlParams['id']
      if (this.id) {
        this.service.getServicoPrestadoById(this.id).subscribe(
          response => {
            this.servico = response
            this.servico.idCliente = this.servico.cliente.id
          },
          errorResponse => this.servico = new ServicoPrestado()
        )
      }
    })
  }

  onSubmit() {
    
    this.servico.valor = String(this.servico.valor)
    
    if (this.id) {
      this.service.atualizar(this.servico)
        .subscribe(
          response => {
            this.exibirMensagemSuccess()
            console.log(response)
          },
          errorResponse => {
            this.mensagemError(errorResponse)
            console.log(errorResponse)
          }
        )
    } else {
      this.service.salvar(this.servico)
        .subscribe(
          response => {
            this.servico = new ServicoPrestado()
            this.exibirMensagemSuccess()
          },
          errorResponse => {
            this.mensagemError(errorResponse)
          })
    }
  }
    
  exibirMensagemSuccess() {
    this.errors = []
    this.mensagemSuccess = 'Serviço salvo com sucesso'
  }

  mensagemError(errorResponse: any) {
    this.errors = []
    this.mensagemSuccess = null
    this.errors = errorResponse.error.errors;
  }

  voltarParaLista() {
    this.router.navigate(['/servico-prestado/lista'])
  }

  fecharAlert() {
    this.mensagemSuccess = null
    this.errors = []
  }

}
