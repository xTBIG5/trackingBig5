import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import { AdvanceOptionsComponent } from '../advance-options/advance-options.component'

@Component({
  selector: 'tb-map-option',
  templateUrl: './map-option.component.html',
  styleUrls: ['./map-option.component.css']
})
export class MapOptionComponent implements OnInit {
  @Input() advanceOptions: AdvanceOptionsComponent
  btnNodes = []
  queryNodes = []
  filteredNodes : Observable<any[]>
  textCtrl:FormControl
  isAccepted = true

  @ViewChild('input') input:any

  constructor() {
  }

  ngOnInit() {
    this.textCtrl = new FormControl();
    this.queryNodes = this.initQueryNodes()
    this.filteredNodes = this.textCtrl.valueChanges
      .pipe(
        startWith(''),
        map(text => this.filterNodes(text))
      )
  }

  filterNodes(text){

    if(text.length>9)
      if(text.slice(-9, text.length)==="__trick__")
        return this.queryNodes

    text = text.toUpperCase()

    let test = false
    for(let letter of text)
      for(let c of "OCEANHAL&|()")
        if(c===letter){
          test = true
          break
        }

    this.refreshQueryNodes()

    if(text==="")
      return this.queryNodes

    let search = (query) => {
      let count = 0
      if(query.length===1){
        for(let letter of text)
          if(query===letter)
            return 3
        for(let i=1;i<text.length;i++){
          let pattern = text.slice(i-1,i+1)
          if(pattern==='OR' && query==='|')
            return 3
          if(pattern==='CL' && query===')')
            return 3
          if(pattern==='OP' && query==='(')
            return 3
        }
        for(let i=2;i<text.length;i++){
          let pattern = text.slice(i-2,i+1)
          if(pattern==="AND" && query==='&')
            return 3
        }
        return 0
      }
      let degreeCounted, dimensionCounted = false
      for(let letter of text){
        if(!degreeCounted && query[0]===letter ){
          degreeCounted = true
          count++
          continue
        }
        if(!dimensionCounted && query[query.length-1]===letter ){
          dimensionCounted = true
          count += 2
        }
        if(degreeCounted&&dimensionCounted)
          break
      }
      return count
    }

    let filterNodes = []
    for(let node of this.queryNodes){
      let count = search(node.query)
      if(count===1){
        node.class.degree="highlight-text"
        node.class.dimension=""
        filterNodes[filterNodes.length] = node
      }
      if(count===2){
        node.class.degree=""
        node.class.dimension="highlight-text"
        filterNodes[filterNodes.length] = node
      }
      if(count===3){
        node.class.degree="highlight-text"
        node.class.dimension="highlight-text"
        filterNodes.unshift(node)
      }
    }

    return filterNodes
  }

  initQueryNodes(){
    let queries = [
      "Hight O",
      "Hight C",
      "Hight E",
      "Hight A",
      "Hight N",
      "Average O",
      "Average C",
      "Average E",
      "Average A",
      "Average N",
      "Low O",
      "Low C",
      "Low E",
      "Low A",
      "Low N",
      "&", "|", "(", ")",
    ]
    let nodes = []
    for(let q of queries){
      nodes.push({
        class:{
          degree:"",
          dimension:''
        },
        query:q,
      })
    }

    return nodes
  }
  getSelectedValue(value){
    value = value.slice(0, value.length - 9)
    let query = value[0]
    if(value.length>1)
      query += "-"+value[value.length-1]

    let colorBtn = (text) => {
      if(text[0]==='&' || text[0]==='|')
        return 'btn-condition'
      if(text[0]==='(' || text[0]===')')
        return 'btn-parentheses'
      return 'btn-big5'
    }
   /* let colorText = (text) => {
      if(text[0]==='&' || text[0]==='|')
        return 'text-condition'
      if(text[0]==='(' || text[0]===')')
        return 'text-parentheses'
      return 'text-big5'
    }*/

    this.btnNodes.push({
      text:query,
      btnColor:colorBtn(value),
      //textColor:colorText(value),
      index:this.btnNodes.length
    })

    this.input.nativeElement.value = ""
    this.refreshQueryNodes()

    if(!this.advanceOptions.isChainedBig5s())
      this.advanceOptions.chainBig5s()
  }


  refreshQueryNodes(){
    for(let node of this.queryNodes){
      node.class.degree = ""
      node.class.dimension = ''
    }
  }

  resetQuery(){
    if(this.btnNodes.length>0){
      this.btnNodes = []
      this.refreshQueryNodes()
    }
  }

  apply(){

    let describer = '('
    for(let node of this.btnNodes)
      describer += node.text
    describer = describer+")"
    console.log(describer)
    this.advanceOptions.addDress({
      describer:describer,
      dress:{
        z:1,
        color:"#A12345",
        type:4,
        size:1.5
      }

    })

    this.resetQuery() 
  }
 }
