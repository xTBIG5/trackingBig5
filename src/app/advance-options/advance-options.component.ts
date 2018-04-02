import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tb-advance-options',
  templateUrl: './advance-options.component.html',
  styleUrls: ['./advance-options.component.css']
})
export class AdvanceOptionsComponent implements OnInit {

  @Input() big5s:any;

  options = [];
  /*frontChain = null;
  mixChain = null;
  unShowChain = null;*/
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
  big5Chain:any


  constructor() { }

  ngOnInit() {
    this.big5Chain = this.makeBig5Chain()
  }

  makeBig5Chain(){
    let chain = Object.create(this.newChain)
    for(let big5 of this.big5s)
      chain.append(big5)
    return chain
  }

  addRule(option){

    for(let option of this.options)
      option.dress.z += 1
    this.options.unshift(option)

    let seacher = this.getSearcher(option.describer)
    let node = this.big5Chain.first
    let noOneCome = true

    while(node){
      if(seacher.checkOut(node.big5)){
        if(node.big5.collection){
          let collection = {dress:option.dress, next:'typescript-_-'}
          collection.next = node.big5.collection
          node.big5.collection = collection
        }else
          node.big5.collection = {dress:option.dress}

        noOneCome = false
       }

      node = node.next
    }

    if(noOneCome)
      return false

    this.refresh({})

    return true

  } 

  refresh(holder){

    for(let o of this.options)
      holder[o.dress.z] = Object.create(this.newChain)
    holder[0] = Object.create(this.newChain)

    let node = this.big5Chain.first
    while(node){
      if(!node.big5.collection)
        holder[0].append(node.big5)
      else
        holder[node.big5.collection.dress.z].append(node.big5)

      node = node.next
    }

    this.big5Chain = holder[this.options[0].dress.z]
    for(let o=1;o<this.options.length;o++){
      let chain = holder[this.options[o].dress.z]
      if(chain.first){
        this.big5Chain.chaining.next = chain.first
        this.big5Chain.chaining = chain.chaining
      }
    }

    let i = this.big5s.length
    node = this.big5Chain.first
    while(node){
      this.big5s[--i] = node.big5
      node = node.next
    }
  }

  deleteRule(z, isRefresh=true){

    let when = 'notYet'
    for(let i=0;i<this.options.length;i++)
      if(this.options[i].dress.z===z){
        this.options.splice(i,1)
        i--
        when = 'now'
      }else if(when==='now')
        this.options[i].dress.z -= 1

    let node = this.big5Chain.first
    while(node){
      let big5 = node.big5
      if(big5.collection)
        if(big5.collection.dress.z===z)
          big5.collection = big5.collection.next
        else{
          let collection = big5.collection
          while(collection.next){
            if(collection.next.dress.z===z){
              collection.next = collection.next.next
              break
            }

            collection = collection.next
          }
        }
      else
        break

      node = node.next
    }

    if(isRefresh)
      this.refresh({})

  }

  changeRule(option){

    this.deleteRule(option.dress.z, false)

    let when = 'notYet'
    for(let i=0;i<this.options.length;i++)
      if(this.options[i].dress.z===option.dress.z && when==='notYet'){
        this.options.splice(i,0,option)
        when = 'now'
      }else if(when==='now')
        this.options[i].dress.z += 1

    let node = this.big5Chain.first
    let z = option.dress.z
    let searcher = this.getSearcher(option.describer)
    while(node){
      let big5 = node.big5
      if(searcher.checkOut(big5)){

        if(big5.collection)
          if(big5.collection.dress.z>z){
            let collection = {dress:option.dress,next:null}
            collection.next = big5.collection
            big5.collection = collection
          }else{
            let collection = big5.collection
            while(collection.next){
              if(collection.next.dress.z>z){
                let collection_ = {dress:option.dress,next:null}
                collection_.next = collection.next
                collection.next = collection_
              }else if(!collection.next.next){
                let collection_ = {dress:option.dress,next:null}
                collection.next.next = collection_
              }

              collection = collection.next
            }
          }
        else
          big5.collection = {dress:option.dress}

      }

      node = node.next
    }

    this.refresh({})
  }

  swapRule(index1, index2){

    let option = this.options[index1]
    this.options[index1] = this.options[index2]
    let z = this.options[index1].dress.z
    this.options[index1].dress.z = option.dress.z
    this.options[index2] = option
    option.dress.z = z

    let reOrder = (dress, holder) => {

      let node = holder
      while(node.next){
        if(node.next.dress.z>dress.z)
          node.next = {dress:dress,next:node.next}
        else if(!node.next.next){
          node.next.next = {dress:dress}
          break
        }

        node = node.next
      }

    }

    let node = this.big5Chain.first
    while(node){
      let collection = node.big5.collection
      if(collection){
        let holder = {next:collection}
        while(collection.next){
          reOrder(collection.next.dress, holder)
          collection = collection.next
        }
        node.big5.collection = holder.next
      }

      node = node.next
    }

    this.refresh({})

  }

/*
  addRule(option){

    let searchRule = (searchChain) => {
      if(!searchChain)
        return

      let addDress = (big5) => {
        let temp = {dress:option.dress, next:'typescript -_-'}
        if(big5.collection)
          temp.next = big5.collection
        big5.collection = temp
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

  deleteRule(_id){

    let holdLowerRule = {}
    let i = 0  
    while(i<this.options.length){
      holdLowerRule[this.options[i].dress._id] = Object.create(this.newChain)
      i++
    }
    
    let unShowBig5 = Object.create(this.newChain)

    let frontBig5 = this.frontChain.first
    let mixBig5 = this.mixChain.first
    let reorderMix = []
    if(this.options[0].dress._id===_id){

      while(frontBig5){
        if(!frontBig5.big5.collection.next)
          unShowBig5.append(frontBig5.big5)
        else{
          frontBig5.big5.collection = frontBig5.big5.collection.next
          holdLowerRule[frontBig5.big5.collection.dress._id].append(frontBig5.big5)
        }
        frontBig5 = frontBig5.next
      }

      while(mixBig5){
        holdLowerRule[mixBig5.big5.collection.dress._id].append(mixBig5.big5)
        mixBig5 = mixBig5.next
      }

      if(this.options.length===1){
        this.options = []
        this.frontChain = null
        return
      }

      this.frontChain = holdLowerRule[this.options[1].dress._id]
      for(let i=2;i<this.options.length;i++)
        reorderMix[reorderMix.length] = this.options[i].dress._id

    }else{

      while(frontBig5){
        let collection = frontBig5.big5.collection
        while(collection.next){
          if(_id===collection.next.dress._id){
            collection.next = collection.next.next
            break
          }
          collection = collection.next
        }
        frontBig5 = frontBig5.next
      }

      while(mixBig5){
        if(mixBig5.big5.collection.dress._id===_id)
          mixBig5.big5.collection = mixBig5.big5.collection.next
        else{
          let collection = mixBig5.big5.collection
          while(collection.next){
            if(_id===collection.next.dress._id){
              collection.next = collection.next.next
              break
            }
            collection = collection.next
          }
        }

        if(mixBig5.big5.collection==null)
          unShowBig5.append(mixBig5.big5)
        else
          holdLowerRule[mixBig5.big5.collection.dress._id].append(mixBig5.big5)

        mixBig5 = mixBig5.next
      }

      for(let i=1;i<this.options.length;i++)
        if(this.options[i].dress._id===_id){
          this.options.splice(i,1)
          i-=1
        }else
          reorderMix[reorderMix.length] = this.options[i].dress._id

    }

    if(reorderMix.length===0)
      this.mixChain = null
    else{
      this.mixChain = holdLowerRule[reorderMix[0]]
      for(let _id of reorderMix){
        this.mixChain.chaining.next = holdLowerRule[_id].first
        this.mixChain.chaining = holdLowerRule[_id].chaining
      }
    }

    if(unShowBig5.first)
      if(this.unShowChain.first){
        this.unShowChain.chaining.next = unShowBig5.first
        this.unShowChain.chaining = unShowBig5.chaining
      }

  }

  changeRule(_id){
    this.deleteRule(_id)
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
