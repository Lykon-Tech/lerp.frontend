import {  Injectable, OnInit, signal, ViewChild } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { BaseService } from "../services/base.service";

export interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

@Injectable()
export abstract class BaseComponente<T extends Object, S> implements OnInit{

    constructor(
        protected messageService: MessageService,
        protected confirmationService: ConfirmationService,
        private service : BaseService<T, S>,
    ) {

    }

    titulo! : string;
    genero : string = 'o';

    dialogo: boolean = false;
   
    lista = signal<T[]>([]);

    objeto: T  = {} as T;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    ngOnInit() {
        
        this.loadDemoData();
    }

    loadDemoData() {
        this.service.findAll().then((data) => {
            this.lista.set(data);
        });

        this.statuses = [
            { label: 'ATIVO', value: true },
            { label: 'INATIVO', value: false }
        ];


    }

    onGlobalFilter(table: Table, event: Event) {
        const target = event.target as HTMLInputElement;

        if (target.tagName.toLowerCase() === 'input' && target.type === 'text') {
            table.filterGlobal(target.value, 'contains');
        }
    }


    openNew() {
        this.objeto = this.getObjectNew();

        this.submitted = false;
        this.dialogo = true;
    }

    getObjetoEdit(objeto: T){
        
        return {... objeto};
    }

    getObjectNew(){
        const obj : T = {} as T;
        (obj as any).ativo = true; 

        return obj;
    }

    edit(objeto: T) {
        this.objeto = this.getObjetoEdit(objeto);
        this.dialogo = true;
    }

    hideDialog() {
        this.dialogo = false;
        this.submitted = false;
    }

    async delete(objeto: T) {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja deletar ' + (objeto as any).nome + '?',
            header: 'Confirmar',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                if ((objeto as any).id != null) {
                    try {
                        await this.service.delete((objeto as any).id);

                        const novaLista = this.lista().filter(b => (b as any)?.id !== (objeto as any).id);
                        this.lista.set([...novaLista]);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: this.titulo + ' deletad' + this.genero,
                            life: 3000
                        });
                    } catch (err) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Falha',
                            detail: 'Falha ao deletar '+ this.genero + ' ' +  this.titulo + ': ' + err,
                            life: 3000
                        });
                    }
                }
            }
        });
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.lista().length; i++) {
            if ((this.lista()[i] as any).id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    getSeverity(ativo: boolean) {
        return ativo ? 'success' : 'danger';
    }

    abstract getValidacoes() :boolean;

    converterObjeto(objeto : T) : S{
        return objeto as unknown as S;
    }

    async save() {
        this.submitted = true;
        let _lista = this.lista();

        if (this.getValidacoes()) {
            try {
            if ((this.objeto as any).id) {
                const updateObject = await this.service.update(this.converterObjeto(this.objeto), (this.objeto as any).id);
                const index = this.findIndexById((updateObject as any).id!);
                const updatedObjects = [..._lista];
                updatedObjects[index] = updateObject;
                this.lista.set(updatedObjects);

                this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: this.titulo + ' atualizad' + this.genero,
                life: 3000
                });
            } else {
                const createdObject = await this.service.create(this.converterObjeto(this.objeto));
                this.lista.set([..._lista, createdObject]);
                

                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: this.titulo + ' criad'+ this.genero,
                life: 3000
                });
            }

            this.dialogo = false;
            (this.objeto as any) = {};
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Falha',
                    detail: 'Falha ao salvar ' + this.titulo + ': ' + error,
                    life: 3000
                });
            }
        }
    }


}