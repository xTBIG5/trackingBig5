import { Component, OnInit, Input} from '@angular/core';
import { MapComponent } from '../map/map.component'

@Component({
  selector: 'tb-map-infor',
  templateUrl: './map-infor.component.html',
  styleUrls: ['./map-infor.component.css']
})
export class MapInforComponent implements OnInit {
  @Input() map: MapComponent
  constructor() { }

  ngOnInit() {
  	let count = 0
  	let int = setInterval(()=>{
  		if(this.map.mapComponent&&this.map.regionPopulation.length>0){
  			clearInterval(int)
  			this.map.mapComponent.degreeing(this.getSearcher('(H-O&H-A&L-C)'))
  		}

  		if(++count===20){
  			clearInterval(int)
  			console.log('test degreeing out of time')
  		}
  	},500)
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
