import { Component, OnInit, Input} from '@angular/core'
import { MapComponent } from '../map/map.component'
import { ChartComponent } from '../chart/chart.component'

@Component({
   selector: 'tb-map-infor',
   templateUrl: './map-infor.component.html',
   styleUrls: ['./map-infor.component.css']
})
export class MapInforComponent implements OnInit {
   @Input() map: MapComponent
   options = []
   howDetail = 'Region'

   constructor() { }


   ngOnInit() {
      this.options.push(Object.create(this.option))

     	let count = 0
     	let int = setInterval(()=>{
     		if(this.map.mapComponent&&this.map.regionPopulation.length>0){
     			clearInterval(int)
     			this.degreeing()
     		}

     		if(++count===20){
     			clearInterval(int)
     			console.log('degreeing out of time')
     		}
     	},100)
   }
  option = {
     dim:'Openness',level:'High',qu:'And',
     getQu(){
        if(this.qu==='And')
           return '&'
        return '|'
     }
  }

  moreOption(){
     this.options.push(Object.create(this.option))
     this.degreeing()
  }

  degreeing(){
     let discriber = '('
     for(let op of this.options)
        discriber += op.level[0]+'-'+op.dim[0]+op.getQu()
     discriber = discriber.slice(0,-1)+')'
     console.log('disriber',discriber)
     if(this.howDetail==='Region')
        this.map.mapComponent.degreeingRegion(this.getSearcher(discriber))
     else
        this.map.mapComponent.degreeingArr(this.getSearcher(discriber))
  }

  switchOrAnd(op){
     if(op.qu==='And')
        op.qu='Or'
     else
        op.qu='And'
     this.degreeing()
  }

  removeOption(op){
     for(let i=0;i<this.options.length;i++)
        if(this.options[i]===op){
           this.options.splice(i,1)
        }
      this.degreeing()
  }

  switchArrReg(){
     if(this.howDetail==='Region'){
        this.howDetail = 'Arrondissement'
        this.map.mapComponent.showArrs()
     }else{
        this.howDetail = 'Region'
        this.map.mapComponent.showOffArrs()
     }
     this.degreeing()
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
           //console.log('andNode')
           //console.log(criterion)
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
        let setAndNode = function(andNode){
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
                    setAndNode(childSearcher)
                    searcher.pushMiddle(criterionAnd)
                    isAndNode = false
                    isOrNode = true
                 }
                 if(describer[i]===')')
                    break
              }
              else if(describer[i]==='&'){
                 setAndNode(childSearcher)
                 isAndNode = true
                 isOrNode = false
              }
           }
           else{
              if(describer[i]==='|' || describer[i]===')'){
                 if(isOrNode)
                    searcher.pushTop(getOrNode(getCriterion()))
                 else{
                    setAndNode(getCriterion())
                    searcher.pushMiddle(criterionAnd)
                    isAndNode = false
                    isOrNode = true
                 }
                 if(describer[i]===')')
                    break
              }
              else if(describer[i]==='&'){
                 setAndNode(getCriterion())
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
