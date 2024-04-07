import { ClientesService } from '../../clientes.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Cliente } from './../cliente';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clientes-form',
  templateUrl: './clientes-form.component.html',
  styleUrls: ['./clientes-form.component.css']
})
export class ClientesFormComponent implements OnInit {

  cliente: Cliente
  mensagemSuccess: string | null = null
  errors: string[] = []
  id!: number

  constructor(
    private service: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.cliente = new Cliente()
  }

  ngOnInit(): void {
    let params: Observable<Params> = this.activatedRoute.params
    params.subscribe(urlParams => {
      this.id = urlParams['id']
      if (this.id) {
        this.service.getClienteById(this.id).subscribe(
          response => this.cliente = response,
          errorResponse => this.cliente = new Cliente()
        )
      }
    })
  }

  onSubmit() {

    if (this.id) {
      this.service.atualiizar(this.cliente)
        .subscribe(
          response => {
            this.exibirMensagemSuccess()
          },
          errorResponse => {
            this.mensagemError(errorResponse)
          })

    } else {
      this.service.salvar(this.cliente)
        .subscribe(
          response => {
            this.cliente = new Cliente()
            this.exibirMensagemSuccess()
          },
          errorResponse => {
            this.mensagemError(errorResponse)
          })
    }

  }

  voltarParaLista() {
    this.router.navigate(['/clientes/lista'])
  }

  exibirMensagemSuccess() {
    this.errors = []
    this.mensagemSuccess = 'Cliente salvo com sucesso'
  }

  mensagemError(errorResponse: any) {
    this.errors = []
    this.mensagemSuccess = null
    this.errors = errorResponse.error.errors
  }

  fecharAlert() {
    this.mensagemSuccess = null
    this.errors = []
  }

}
