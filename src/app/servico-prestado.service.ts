import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicoPrestado } from './servico-prestado/servicoPrestado';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ServicoPrestadoBusca } from './servico-prestado/servico-prestado-lista/servicoPrestadoBusca';

@Injectable({
  providedIn: 'root'
})
export class ServicoPrestadoService {

  apiURL: string = environment.apiURLBase + '/api/servicos-prestados'

  constructor(private http: HttpClient) { }

  salvar(servicoPrestado: ServicoPrestado): Observable<ServicoPrestado>{
    return this.http.post<ServicoPrestado>(this.apiURL, servicoPrestado)
  }

  atualizar(servicoPrestado: ServicoPrestado): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${servicoPrestado.id}`, servicoPrestado)
  }

  deletar(servicoPrestado: ServicoPrestado): Observable<any> {
    return this.http.delete<any>(`${this.apiURL}/${servicoPrestado.id}`)
  }

  getServicoPrestado(nome: string, mes: number): Observable<ServicoPrestadoBusca[]> {
    const httpParams = new HttpParams()
      .set("nome", nome)
      .set("mes", mes)

    const url = this.apiURL + "?" + httpParams.toString()
    return this.http.get<any>(url)
  }

  getServicoPrestadoById(id: number): Observable<ServicoPrestado> {
    return this.http.get<any>(`${this.apiURL}/${id}`)
  }
}
