import { Component, OnInit, Input } from '@angular/core';
import { MapComponent } from '../map/map.component'

@Component({
  selector: 'tb-advance-options',
  templateUrl: './advance-options.component.html',
  styleUrls: ['./advance-options.component.css']
})
export class AdvanceOptionsComponent implements OnInit {

  @Input() map:MapComponent;

  options = [];
  newChain = {
    first:{},
    chaining:{},
    append(big5){
      if(this.first.big5){
        this.chaining.next = {big5:big5}
        this.chaining = this.chaining.next
      }else{
        this.first = {big5:big5}
        this.chaining = this.first
        console.log(this)
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
    for(let big5 of this.map.big5s)
      chain.append(big5)
    return chain
  }

  addRule(option){

    for(let option of this.options)
      option.dress.z += 1
    this.options.unshift(option)

    if(this.options.length===1){
      let node = this.big5Chain.first
      while(node){
        delete node.big5.collection
        node = node.next
      }
    }

    let seacher = this.getSearcher(option.describer)
    let node = this.big5Chain.first
    let noOneComes = true

    while(node){
      if(seacher.checkOut(node.big5)){
        if(node.big5.collection)
          node.big5.collection = {dress:option.dress, next:node.big5.collection}
        else
          node.big5.collection = {dress:option.dress}
        node.big5.collection.shapePoints = this.map.shaping(node.big5.lon, node.big5.lat, option.dress.type, option.dress.size)

        noOneComes = false
       }

      node = node.next
    }

    if(noOneComes)
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
      if(node.big5.collection)
        holder[node.big5.collection.dress.z].append(node.big5)
      else
        holder[0].append(node.big5)

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

    let big5s = this.map.big5s
    let i = big5s.length
    node = this.big5Chain.first
    while(node){
      big5s[--i] = node.big5
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
          if(big5.collection.dress.z>z)
            big5.collection = {dress:option.dress,next:big5.collection}
          else{
            let collection = big5.collection
            while(collection.next){
              if(collection.next.dress.z>z)
                collection.next = {dress:option.dress,next:collection.next}
              else if(!collection.next.next)
                collection.next.next = {dress:option.dress}

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

  getSearcher(describer){
    let Searcher = {
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
            node.next = temp.next
            temp.next = node
          }
          else
            temp.next = node
        }
        else
          this.node = node
      }
    }

    let OrNode = {
      setBig5Criterion(criterion){
        this.criterion = criterion
      },
      checkOut(big5){
        return this.criterion.checkOut(big5)
      }
    }

    let AndNode = {
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

      let getOrNode = function(orNode){
        let criterionOr = Object.create(OrNode)
        criterionOr.setBig5Criterion(orNode)
        return criterionOr
      }
      let getAndNode = function(andNode){
        if(!isAndNode)
          criterionAnd = Object.create(AndNode)
        criterionAnd.pushBig5Criterion(andNode)
      }
      let getCriterion = function(){
        let criterion = Object.create(Criterion)
        criterion.setCriterion(describer[i-1], getDegree(describer[i-3]))
        return criterion
      }

      let searcher = Object.create(Searcher)
      let isOrNode = true
      let isAndNode = false
      let criterionAnd

      while(describer[i-1]!==')'){
        if(describer[i]==='('){
          i++
          let childSearcher = noding()

          if(describer[i]==='|' || describer[i]===')'){
            if(isOrNode)
              searcher.pushBottom(getOrNode(childSearcher))
            else{
              searcher.pushMiddle(getAndNode(childSearcher))
              isAndNode = false
              isOrNode = true
            }
          }
          else if(describer[i]==='&'){
            getAndNode(childSearcher)
            isAndNode = true
            isOrNode = false
          }
        }
        else{
          if(describer[i]==='|' || describer[i]===')'){
            if(isOrNode)
              searcher.pushTop(getOrNode(getCriterion()))
            else{
              searcher.pushMiddle(getAndNode(getCriterion()))
              isAndNode = false
              isOrNode = true
            }
          }
          else if(describer[i]==='&'){
            getAndNode(getCriterion())
            isAndNode = true
            isOrNode = false
          }

        }

        i++
      }
      return searcher
    }

    let i = 1;
    let searcher = noding()
    return searcher
  }


}
