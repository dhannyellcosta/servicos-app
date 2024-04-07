import { Cliente } from './clientes/cliente';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  apiURL: string = environment.apiURLBase + '/api/clientes'

  constructor(private http: HttpClient) { }

  salvar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiURL, cliente)
  }

  atualiizar(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${cliente.id}`, cliente)
  }

  deletar(cliente: Cliente): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${cliente.id}`)
  }

  getClientes(nome: string, cpf: string): Observable<Cliente[]> {
    const httpParams = new HttpParams()
      .set("nome", nome)
      .set("cpf", cpf)

    const url = this.apiURL + "?" + httpParams.toString()
    return this.http.get<Cliente[]>(url)
  }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<any>(`${this.apiURL}/${id}`)
  }
}
