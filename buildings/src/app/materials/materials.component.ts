import { Component, OnInit } from '@angular/core';
import { NgForm, Form } from '@angular/forms';
import { MaterialsApiService } from './materials-api.service';
import { CreateInterface } from './interface/create-interface';

import { SidebarService } from '../sidebar/sidebar.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css'],
  providers: [MaterialsApiService]
})
export class MaterialsComponent implements OnInit {

  public materialsList: any = [];

  public create: CreateInterface;

  public materialsEdit: any = {
    idEdit: '',
    nameEdit: '',
    unit_measureEdit: '',
    priceEdit: null,
    stockEdit: null,
    total_productEdit: null
  };

  isLoading: any = {
    'get': false,
    'form': false,
    'delete': false,
    'put': false,
    'post': false
  };

  constructor(
    public sidebarService: SidebarService,
    private api: MaterialsApiService
    ) { 
      this.create = {
        name: '',
        unit_measure: '',
        price: null,
        stock: null,
        total_product: null
      }
    }

  ngOnInit(): void {
    this.getMaterial();
  }

  public getMaterial(): void {
    this.materialsList = [];
    this.isLoading['get'] = true;

    this.api.getMaterials().subscribe(response => {
      for (let i=0; i < response.data.length; i++){

        this.materialsList.push({
          id: response.data[i].id,
          name: response.data[i].name,
          unit_measure:response.data[i].unit_measure,
          price: response.data[i].price,
          stock: response.data[i].stock,
          total_product: response.data[i].total_product
        });
      }
      this.isLoading['get'] = false;
    }, error => {
      alert('No ha sido posible mostrar los Materiales');
      this.isLoading['get'] = false;
    })
  }

  public addMaterials(): void {
    this.isLoading['form'] = false;
    this.isLoading['put'] = false;

  }

  public createMaterials(form: NgForm){
    if (form.valid === true){
      this.isLoading['form'] = true;

      let total_product = form.value.price * form.value.stock;

      const body = {
        name: form.value.name,
        unit_measure:form.value.unit_measure,
        price: form.value.price,
        stock: form.value.stock,
        total_product: total_product
      };

      this.api.addMaterials(body).subscribe(respose => {
        this.materialsList = [];
        alert('El Material se agrego correctamente');
        this.getMaterial();
        form.resetForm();
        this.sidebarService.close('add-materials');
        this.isLoading['form'] = false;
      }, error =>{
        alert('Hubo un problema al agregar el material');
        this.isLoading['form'] = false;
      })
    }
  }

  public editMaterials(id: number) {

    this.isLoading['put'] = true;
    const materialsRes = this.materialsList.find(result => result.id === id);
    
    this.materialsEdit.idEdit = materialsRes.id;
    this.materialsEdit.nameEdit = materialsRes.name;
    this.materialsEdit.unit_measureEdit = materialsRes.unit_measure;
    this.materialsEdit.priceEdit = materialsRes.price;
    this.materialsEdit.stockEdit = materialsRes.stock;
    this.materialsEdit.total_productEdit = materialsRes.total_product;

  }

  public updateMaterials(form: NgForm, id: number){
    if (form.valid === true){
      this.isLoading['form'] = false;
      
      let total_product = form.value.priceEdit * form.value.stockEdit;

      const body = {
        name: form.value.nameEdit || this.materialsEdit.nameEdit,
        unit_measure:form.value.unit_measureEdit || this.materialsEdit.unit_measureEdit,
        price: form.value.priceEdit || this.materialsEdit.priceEdit,
        stock: form.value.stockEdit || this.materialsEdit.stockEdit,
        total_product: total_product
      };

      this.api.updateMaterials(id,body).subscribe(res => {
        alert('El material se ha modificado correctamente');
        this.getMaterial();
        form.resetForm();
        this.isLoading['form'] = false;
      },error => {
        alert('Hubo un problema al modificar el material');
        this.isLoading['form'] = false;
      });

    }else {

    }
  }

  public removeMaterials(id: number){
    this.isLoading['delete'] = true;
    if (confirm('¿Está seguro que desea eliminar el material? \n Esta acción no se podra deshacer.')){

      const materialsRes = this.materialsList.find(result => result.id === id);
      if (materialsRes.stock == 0){
        this.api.deleteMaterials(id).subscribe(res => {
          this.materialsList = [];
          this.isLoading['delete'] = false;
          this.getMaterial();
          alert('El material ha sido eliminada correctamente');
        }, error => {
          alert('Hubo un problema al eliminar el material');
          this.isLoading['delete'] = false;
        });
      }else {
        alert('No se puede eliminar el material ya que tiene stock');
        this.isLoading['delete'] = false;
      }
      
    }else{
      this.isLoading['delete'] = false;
    }
  }
  
}
