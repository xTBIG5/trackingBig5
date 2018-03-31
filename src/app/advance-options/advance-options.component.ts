import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tb-advance-options',
  templateUrl: './advance-options.component.html',
  styleUrls: ['./advance-options.component.css']
})
export class AdvanceOptionsComponent implements OnInit {

  @Input() big5s:any;

  options = [];
  frontChain = null;
  mixChain = null;
  unShowChain = null;

  constructor() { }

  ngOnInit() {
      this.unShowChain = this.makeOriginChain()
  }

  addRule(option){

    let searchRule = (searchChain) => {
      if(!searchChain)
        return

      let addDress = (big5) => {
        if(big5.dress)
          option.dress.next = big5.dress
        big5.dress = option.dress
      }

      let node = searchChain.first

      while(searcher.checkOut(node.big5)){
        newRuleChain.append(node.big5)
        addDress(node.big5)
        if(node.next){
          searchChain.first = node.next
          node = node.next
        }else{
          delete searchChain.first
          return
        }
      }
      
      while(node.next)
        if(searcher.checkOut(node.next.big5)){
          newRuleChain.append(node.next.big5)
          addDress(node.big5)
          node.next = node.next.next
        }else
          node = node.next
      searchChain.chaining = node
    }

    this.options[this.options.length] = option

    let newRuleChain = Object.create(this.newChain)
    let searcher = this.getSearcher(option.describer)

    searchRule(this.frontChain)
    searchRule(this.mixChain)
    searchRule(this.unShowChain)

    if(newRuleChain.first){
      //typescript -_-
      if(!this.mixChain)
        if(this.frontChain && this.frontChain.first)
          this.mixChain = this.frontChain
      else if(this.mixChain.first && this.frontChain && this.frontChain.first){
        this.mixChain.chaining.next = this.frontChain.first
        this.mixChain.chaining = this.frontChain.chaining
      }
      this.frontChain = newRuleChain
      if(!this.mixChain.first)
        this.mixChain = null
      if(this.unShowChain && !this.unShowChain.first)
        this.unShowChain = null

      this.changeOrder()
    }else{
      //tell user to redescribe the rule
    }
  }

  changeOrder(){
    let i = this.big5s.length
    let big5 = this.big5s

    let turning = (turner) => {
      while(turner){
        big5[--i] = turner.big5
        turner = turner.next
      }
    }

    turning(this.frontChain.first)
    
    if(this.mixChain)
      turning(this.mixChain.first)

    if(this.unShowChain)
      turning(this.unShowChain.first)
  }


  makeOriginChain(){
    let chain = Object.create(this.newChain)
    for(let big5 of this.big5s)
      chain.append(big5)
    return chain
  }

  newChain = {
    first:{},
    chaining:{},
    append(big5){
      if(this.first){
        this.chaining.next = {big5:big5}
        this.chaining = this.chaining.next
      }else{
        this.first = {big5:big5}
        this.chaining = {big5:big5}
      }
    }
  }

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
