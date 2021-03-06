import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from '../../map.service';

@Component({
  selector: 'tb-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  big5Collection: any
  big5s:any
  regionPopulation = []
  mapComponent: any

  latitude_   :number;
  longitude_  :number;
  y_  :number;
  x_  :number;
  x_x_Width   :number;
  y_y_Height  :number;
  dlat  :number;
  dlon  :number;

  colors = ["#04A0E3", "#E43400", '#E0D000', '#33AC00', '#7B00A7', '#A70000']
  talkingColors = ['#56CCFF', '#FF6336', '#FEF248', '#9DFF74', '#D358FF', '#FE2A2A']

  constructor( private mapService: MapService ) { }

  ngOnInit() {
    this.getRegionPopulation()
  }

  ngAfterViewInit() {
       console.log("do after init");
  }
  getRegionPopulation(): void {
    this.mapService.getRegionPopulation()
    .subscribe(population => {
      this.regionPopulation = population;
      this.embedFuncs()
    });
  }

  getBig5s(collectBig5): void {
    this.mapService.getBig5s()
    .subscribe(collection => {
      this.big5Collection = collection;
      this.big5s = collectBig5(collection)
      //this.doParty();
    });
  }

  getBig5sTest(collectBig5){
    this.big5Collection = this.mapService.getBig5sTest()
    this.big5s = collectBig5(this.mapService.getBig5sTest())

  }

  embededFuncs = {
    getRegionPopulationRate(searcher){
      let count = 0
      for(let arr of this.arrs)
        count += arr.checkArrPopulation(searcher)
      return count/this.population
    },
    checkArrPopulation(searcher){
      let count = 0
      for(let site of this.sites)
        count += site.checkSitePopulation(searcher)
      return count
    },
    getArrPopulationRate(searcher){
      return this.checkArrPopulation(searcher)/this.population
    },
    checkSitePopulation(searcher){
      let count = 0
      for(let big5 of this.users)
        if(searcher.checkOut(big5)){
          count += 1
        }
      return count
    },
    getSitePopulationRate(searcher){
      return this.checkSitePopulation(searcher)/this.population
    }
  }

  embedFuncs(){
    for(let region of this.regionPopulation){
      region.getRegionPopulationRate = this.embededFuncs.getRegionPopulationRate
      for(let arr of region.arrs){
        arr.checkArrPopulation = this.embededFuncs.checkArrPopulation
        arr.getArrPopulationRate = this.embededFuncs.getArrPopulationRate
        for(let site of arr.sites){
          site.checkSitePopulation = this.embededFuncs.checkSitePopulation
          site.getSitePopulationRate = this.embededFuncs.getSitePopulationRate
        }
      }
    }
  }

  doParty(speed=25,step=10,showWhat='highestdimensionDegree'){

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
      let type=1, size=2
      let dresses = [
        {size:size, type:type, color:this.colors[0]},
        {size:size, type:type, color:this.colors[1]},
        {size:size, type:type, color:this.colors[2]},
        {size:size, type:type, color:this.colors[3]},
        {size:size, type:type, color:this.colors[4]},
        {size:size, type:type, color:this.colors[5]},
      ]

      let count = 0;
      big5.collection = {
        shapePoints:this.shaping(big5.lon, big5.lat, type, size)
      }

      for(let i=0;i<5;i++){
        if(big5[dimensions[i]]===degree){
          if(++count>1){
            big5.collection.dress = dresses[5]
            break
          }
          else
            big5.collection.dress = dresses[i]
        }
      }

      if(big5.collection.dress==null)
        delete big5.collection
      /*let randomIndex = Math.floor(Math.random()*5)
      for(i = randomIndex;i<5;i++)
        turn()
      for(i=0;i<randomIndex;i++)
        turn()*/
      
    }

    let dressUpBig5ShowOneDimension = (big5) => {
      let type=1, size=1
      let dresses = [
        {size:size, type:type, color:this.colors[0]},
        {size:size, type:type, color:this.colors[1]},
        {size:size, type:type, color:this.colors[2]},
        {size:size, type:type, color:this.colors[3]},
        {size:size, type:type, color:this.colors[4]},
        {size:size, type:type, color:this.colors[5]},
      ]
      big5.collection = {
        shapePoints:this.shaping(big5.lon, big5.lat, type, size)
      }

      let dimension = showWhat[4]
      let degree = big5[dimension]
      if(degree===3)
        big5.collection.dress.color = dresses[0]
      if(degree===2)
        big5.collection.dress.color = dresses[2]
      else
        big5.collection.dress.color = dresses[3]
    }

    let dimensions = ['O', 'C', 'E', 'A', 'N']
    let dressUpBig5 = (big5) => {}
    let index = 0
    
    if(showWhat.slice(0,4)==='only')
      dressUpBig5 = dressUpBig5ShowOneDimension
    else{
      var degree = 2;
      if(showWhat[0]==='h')
        degree = 3
      if(showWhat[0]==='l')
        degree = 1
      dressUpBig5 = dressUpBig5ShowOneDegreeDimension
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
    //console.log("eeererer")
    return y
  }

  mouseenter(event, big5){
    console.log('hey')
    let talkingColor = (color) => {
      for(let i=0;i<6;i++)
        if(this.colors[i]===color)
          return this.talkingColors[i]
      return this.talkingColors[0]
    }
    event.target.setAttribute('fill',talkingColor(big5.collection.dress.color))
    event.target.setAttribute('points',this.shaping(big5.lon, big5.lat, big5.collection.dress.type, big5.collection.dress.size*1.5))
  }
  
  mouseleave(event, big5){
    event.target.setAttribute('fill', big5.collection.dress.color)
    event.target.setAttribute('points',this.shaping(big5.lon, big5.lat, big5.collection.dress.type, big5.collection.dress.size))
  }

}
