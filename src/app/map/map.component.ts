import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from '../map.service';
import { Big5 } from '../share/big5';

@Component({
  selector: 'tb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  big5s: any;
  options = [];

  latitude_    = 14.5;
  longitude_   = -14.5;
  y_ = 12.6 + 136.94363271933562;
  x_ = 12.6 + 186.63049838495695;
  x_x_Width    = 383.088901314467 - 186.63049838495695;
  y_y_Height   = 271.78538763862565 - 136.94363271933562;
  dlat = 2;
  dlon = 3;

  colors = ["#04A0E3", "#E43400", '#E0D000', '#33AC00', '#7B00A7', '#A70000']
  talkingColors = ['#56CCFF', '#FF6336', '#FEF248', '#9DFF74', '#D358FF', '#FE2A2A']


  //mapService MapService
  constructor( private mapService: MapService ) { }

  ngOnInit() {
    //this.getBig5s();
    this.big5s = this.mapService.getBig5sTest();
    this.doParty();
  }
  ngAfterViewInit() {
       //Copy in all the js code from the script.js. Typescript will complain but it works just fine
       console.log("do after init");
       //console.log(this.big5s[3])
       //this.doParty();
   }
  getBig5s(): void {
    this.mapService.getBig5s()
    .subscribe(big5s => {
      this.big5s = big5s;
      this.doParty();
    });
  }
 
  //cam ddor #F43D07
  //tims #B610F1
  //lucj #51E712
  //vangf tuowi #F0E442
  //lam  #0CB0F6
  doParty(speed=25,step=10,showWhat='highestdimensionDegree',option=null){

    let dressing = () => {
      if(index>this.big5s.length)
        clearInterval(iterate)

      if(step>this.big5s.length-index)
        step = this.big5s.length-index

      for(let i=0;i<step;i++){
        let big5 = this.big5s[index++];
        dressUpBig5(big5)
      }
    }

    let dressUpBig5ShowOneDegreeDimension = (big5) => {

      let turn = () => {
        if(big5[dimensions[i]]===degree){
          big5.dress = {}
          if(++count>1){
            big5.dress.color = this.colors[5]
            return
          }
          big5.dress.color = this.colors[i]
        }
      }

      let randomIndex = Math.floor(Math.random()*5)
      let i=0;
      let count = 0;

      for( ;i<randomIndex;i++)
        turn()
      for(i = randomIndex;i<5;i++)
        turn()
      
    }

    let dressUpBig5ShowOneDimension = (big5) => {
      big5.dress = {}
      let dimension = showWhat[4]
      let degree = big5[dimension]
      if(degree===3)
        big5.dress.color = this.colors[0]
      if(degree===2)
        big5.dress.color = this.colors[2]
      else
        big5.dress.color = this.colors[3]
    }

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
    }

    let getSearcher = (describer) => {
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

    let dimensions = ['O', 'C', 'E', 'A', 'N']
    let dressUpBig5 = (big5) => {}
    let index = 0

    if(option){
      var searcher = getSearcher(option.describer)
      dressUpBig5 = dressUpBig5ShowAsOptions
    }
    else{
      if(showWhat.slice(0,4)==='only')
        dressUpBig5 = dressUpBig5ShowOneDimension
      else{
        var degree = 2;
        if(showWhat[0]==='h')
          degree = 3
        if(showWhat[0]==='l')
          degree = 1
        dressUpBig5 = dressUpBig5ShowOneDegreeDimension
        for(let big5 of this.big5s)
          delete big5.dress
      }
    }
    let iterate = setInterval(dressing,speed)
  }


  shaping(longitude, latitude, type, size){
    let x = this.convertToX(longitude)
    let y = this.convertToY(latitude)

    if(type===1)
      return `${x},${y-size} ${x+size*.9},${y} ${x},${y+size} ${x-size*.9},${y}`
    if(type===2){
      let sin60 = 0.8660254037844386
      let tan30 = 0.5773502691896257
      return x+','+(y-size)+' '+(x+size*sin60)+','+(y+size/2)+' '+(x-sin60*size)+','+(y+size/2)
             +' '+(x-size*tan30/2)+','+(y-size/2)+' '+(x+size*sin60)+','+(y-size/2)+' '
             +x+','+(y+size)+' '+(x-size*sin60)+','+(y-size/2)+' '+(x-size*tan30/2)+','+(y-size/2)
    }
    if(type===3){
      let sin45 = 0.7071067811865475
      let sin45size = sin45*size
      return x+','+(y-size)+' '+(x+sin45size)+','+(y-sin45size)+' '+(x+size)+','+y
              +' '+(x+sin45size)+','+(y+sin45size)+' '+x+','+(y+size)+' '+(x-sin45size)+','+(y+sin45size)
              +' '+(x-size)+','+y+' '+(x-sin45size)+','+(y-sin45size)
    }
    if(type===4)
      return (x+size*.6)+','+(y-size)+' '+(size*1.2+x)+','+(y-.4*size)+' '+x+','+(y+size)
             +' '+(x-size*1.2)+','+(y-size*.4)+' '+(x-.6*size)+','+(y-size)
  }
  
  convertToX(longitude){
    let dx = (-this.longitude_ + longitude)*(this.x_x_Width/this.dlon);
    let x = this.x_+dx;
    return x
  }

  convertToY(latitude){
    let dlatC = this.latitude_ - latitude;
    let dy = dlatC*this.y_y_Height/this.dlat;
    if(dlatC<0)
        dy += dlatC*.5
    let y = this.y_+dy;
    return y
  }

  mouseenter(big5){
    let talkingColor = (color) => {
      for(let i=0;i<6;i++)
        if(this.colors[i]===color)
          return this.talkingColors[i]
      return this.talkingColors[0]
    }
    big5.dress.color = talkingColor(big5.dress.color)
    big5.dress.size = big5.dress.size*1.3
  }
  
  mouseleave(big5){
    let color = (talkingcolor) => {
      for(let i=0;i<6;i++)
        if(this.talkingColors[i]===talkingcolor)
          return this.colors[i]
      return this.colors[0]
    }
    big5.dress.color = color(big5.dress.color)
    big5.dress.size = big5.dress.size/1.3
  }
}
