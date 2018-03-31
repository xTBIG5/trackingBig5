import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tb-map-option',
  templateUrl: './map-option.component.html',
  styleUrls: ['./map-option.component.css']
})
export class MapOptionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
/*
    let dressUpBig5ShowAsOptions = (big5) => {
      if(searcher.checkOut()){
        let dress = Object()
        dress.name = option.name
        dress.color = option.color
        dress.size = option.size
        dress.type = option.type
        
        if(big5.dress){
          dress.next = big5.dress
          big5.dress = dress
        }
        else
          big5.dress = dress
      }
    }*/

  getSearcher(describer){
    let CheckOut = {
      node : null,
      orObjectNumber : 0,

      checkOut(big5){
        let temp = this.node
        while(temp){
          if(temp.checkOut(big5))
            return true
          temp = temp.next
        }
        return false
      },
      pushTop(node){
        if(this.node){
          node.next = this.node
          this.node = node
        }
        else
          this.node = node
        this.orObjectNumber++
      },
      pushBottom(node){
        if(this.node){
          let temp = this.node
          while(temp.next)
            temp = temp.next
          temp.next = node
        }
        else
          this.node = node
      },
      pushMiddle(node){
        if(this.node){
          let temp = this.node
          for(let i = 1; i<this.orObjectNumber;i++)
            temp = temp.next
          if(temp.next){
            let temp2 = temp.next
            temp.next = node
            temp.next = temp2
          }
          else
            temp.next = node
        }
        else
          this.node = node
      }
    }

    let OrNode = {
      getBig5Criterion(criterion){
        this.criterion = criterion
      },
      checkOut(big5){
        return this.criterion.checkOut(big5)
      }
    }

    let AndNode = {
      criteria:null,
      pushBig5Criterion(criterion){
        if(this.criteria){
          let temp = this.criteria
          while(temp.next)
            temp = temp.next
          temp.next = criterion
        }
        else
          this.criteria = criterion
      },
      checkOut(big5){
        let temp = this.criteria
        while(temp){
          if(!temp.checkOut(big5))
            return false
          temp = temp.next
        }
        return true
      }
    }

    let Criterion = {
      key:null,
      degree:null,
      setCriterion(key, degree){
        this.key = key
        this.degree = degree
      },
      checkOut(big5){
        return big5[this.key]===this.degree
      }
    }

    let noding = () => {
      let getDegree = function(level){
        if(level==='H')
          return 3
        if(level==='L')
          return 1
        return 2
      }

      let getOrNode = function(){
        let criterionOr = Object.create(OrNode)
        criterionOr.setBig5Criterion(getCriterion())
        return criterionOr
      }
      let getAndNode = function(childNode=null){
        if(!isAndNode)
          var criterionAnd = Object.create(AndNode)
        if(childNode)
          criterionAnd.setBig5Criterion(getCriterion())
        else
          criterionAnd.pushBig5Criterion(childNode)
        return criterionAnd
      }
      let getCriterion = function(){
        let criterion = Object.create(Criterion)
        criterion.setCriterion(describer[i-1], getDegree(describer[i-3]))
        return criterion
      }

      let node = Object.create(CheckOut)
      let isOrNode = true
      let isAndNode = false

      while(describer[i-1]!==')'){
        if(describer[i]==='('){
          i++
          let childNode = noding()

          if(describer[i]==='|' || describer[i]===')'){
            if(isOrNode)
              node.pushBottom(childNode)
            else{
              node.pushMiddle(getAndNode(childNode))
              isAndNode = false
            }
          }
          else if(describer[i]==='&'){
            getAndNode(childNode)
            isAndNode = true
          }
        }
        else{
          if(describer[i]==='|' || describer[i]===')'){
            if(isOrNode)
              node.pushTop(getOrNode())
            else{
              node.pushMiddle(getAndNode())
              isAndNode = false
            }
          }
          else if(describer[i]==='&'){
            getAndNode()
            isAndNode = true
          }

        }

        i++
      }

      return node
    }

    let i = 1;
    let searcher = noding()
    return searcher
  }

 }
