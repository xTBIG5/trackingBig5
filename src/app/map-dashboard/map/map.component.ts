import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapService } from '../../service/map.service';

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
  chartComponent: any

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
      this.embedSVG()
      this.mapComponent.showRegionsAndSites()
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

  getCoutryPopulationBig5Rate(){
      let dims = [
           {L:0,A:0,H:0,type:'Country'},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
         ]
      let population = this.regionPopulation.length
      for(let region of this.regionPopulation){
        let dimsRegion = region.getRegionPopulationBig5Rate()
        dims[0].H += dimsRegion[0].H*region.population
        dims[0].A += dimsRegion[0].A*region.population

        dims[1].H += dimsRegion[1].H*region.population
        dims[1].A += dimsRegion[1].A*region.population

        dims[2].H += dimsRegion[2].H*region.population
        dims[2].A += dimsRegion[2].A*region.population

        dims[3].H += dimsRegion[3].H*region.population
        dims[3].A += dimsRegion[3].A*region.population

        dims[4].H += dimsRegion[4].H*region.population
        dims[4].A += dimsRegion[4].A*region.population
      }
      
      dims[0].H = dims[0].H/population
      dims[0].A = dims[0].A/population
      dims[0].L = 1-dims[0].A-dims[0].H

      dims[1].H = dims[1].H/population
      dims[1].A = dims[1].A/population
      dims[1].L = 1-dims[1].A-dims[1].H

      dims[2].H = dims[2].H/population
      dims[2].A = dims[2].A/population
      dims[2].L = 1-dims[2].A-dims[2].H

      dims[3].H = dims[3].H/population
      dims[3].A = dims[3].A/population
      dims[3].L = 1-dims[3].A-dims[3].H

      dims[4].H = dims[4].H/population
      dims[4].A = dims[4].A/population
      dims[4].L = 1-dims[4].A-dims[4].H

      return dims
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
    },


    getRegionPopulationBig5Rate(){
      let dims = [
           {L:0,A:0,H:0,type:'Region'},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
         ]
      for(let arr of this.arrs){
        let dimsArrs = arr.getArrPopulationBig5Rate()
        dims[0].H += dimsArrs[0].H*arr.population
        dims[0].A += dimsArrs[0].A*arr.population

        dims[1].H += dimsArrs[1].H*arr.population
        dims[1].A += dimsArrs[1].A*arr.population

        dims[2].H += dimsArrs[2].H*arr.population
        dims[2].A += dimsArrs[2].A*arr.population

        dims[3].H += dimsArrs[3].H*arr.population
        dims[3].A += dimsArrs[3].A*arr.population

        dims[4].H += dimsArrs[4].H*arr.population
        dims[4].A += dimsArrs[4].A*arr.population
      }
      
      dims[0].H = dims[0].H/this.population
      dims[0].A = dims[0].A/this.population
      dims[0].L = 1-dims[0].A-dims[0].H

      dims[1].H = dims[1].H/this.population
      dims[1].A = dims[1].A/this.population
      dims[1].L = 1-dims[1].A-dims[1].H

      dims[2].H = dims[2].H/this.population
      dims[2].A = dims[2].A/this.population
      dims[2].L = 1-dims[2].A-dims[2].H

      dims[3].H = dims[3].H/this.population
      dims[3].A = dims[3].A/this.population
      dims[3].L = 1-dims[3].A-dims[3].H

      dims[4].H = dims[4].H/this.population
      dims[4].A = dims[4].A/this.population
      dims[4].L = 1-dims[4].A-dims[4].H

      return dims
    },
    getArrPopulationBig5Rate(){
      let dims = [
           {L:0,A:0,H:0,type:'Arrondissement'},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
         ]
      for(let site of this.sites){
        let dimsSite = site.getSitePopulationBig5Rate()
        dims[0].H += dimsSite[0].H*site.population
        dims[0].A += dimsSite[0].A*site.population

        dims[1].H += dimsSite[1].H*site.population
        dims[1].A += dimsSite[1].A*site.population

        dims[2].H += dimsSite[2].H*site.population
        dims[2].A += dimsSite[2].A*site.population

        dims[3].H += dimsSite[3].H*site.population
        dims[3].A += dimsSite[3].A*site.population

        dims[4].H += dimsSite[4].H*site.population
        dims[4].A += dimsSite[4].A*site.population
      }

      dims[0].H = dims[0].H/this.population
      dims[0].A = dims[0].A/this.population
      dims[0].L = 1-dims[0].A-dims[0].H

      dims[1].H = dims[1].H/this.population
      dims[1].A = dims[1].A/this.population
      dims[1].L = 1-dims[1].A-dims[1].H

      dims[2].H = dims[2].H/this.population
      dims[2].A = dims[2].A/this.population
      dims[2].L = 1-dims[2].A-dims[2].H

      dims[3].H = dims[3].H/this.population
      dims[3].A = dims[3].A/this.population
      dims[3].L = 1-dims[3].A-dims[3].H

      dims[4].H = dims[4].H/this.population
      dims[4].A = dims[4].A/this.population
      dims[4].L = 1-dims[4].A-dims[4].H

      return dims
    },
    getSitePopulationBig5Rate(){
      let dims = [
           {L:0,A:0,H:0,type:'Site'},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
           {L:0,A:0,H:0},
         ]
      if(this.users.length===0)
        return dims
      for(let big5 of this.users){
        if(big5.O===3)
          dims[0].H++
        else if(big5.O===2)
          dims[0].A++

        if(big5.C===3)
          dims[1].H++
        else if(big5.C===2)
          dims[1].A++

        if(big5.E===3)
          dims[2].H++
        else if(big5.E===2)
          dims[2].A++

        if(big5.A===3)
          dims[3].H++
        else if(big5.A===2)
          dims[3].A++

        if(big5.N===3)
          dims[4].H++
        else if(big5.N===2)
          dims[4].A++
      }

      dims[0].H = dims[0].H/this.population
      dims[0].A = dims[0].A/this.population
      dims[0].L = 1-dims[0].A-dims[0].H

      dims[1].H = dims[1].H/this.population
      dims[1].A = dims[1].A/this.population
      dims[1].L = 1-dims[1].A-dims[1].H

      dims[2].H = dims[2].H/this.population
      dims[2].A = dims[2].A/this.population
      dims[2].L = 1-dims[2].A-dims[2].H

      dims[3].H = dims[3].H/this.population
      dims[3].A = dims[3].A/this.population
      dims[3].L = 1-dims[3].A-dims[3].H

      dims[4].H = dims[4].H/this.population
      dims[4].A = dims[4].A/this.population
      dims[4].L = 1-dims[4].A-dims[4].H

      return dims
    },
  }

  embedFuncs(){
    for(let region of this.regionPopulation){
      region.getRegionPopulationRate = this.embededFuncs.getRegionPopulationRate
      region.getRegionPopulationBig5Rate = this.embededFuncs.getRegionPopulationBig5Rate
      for(let arr of region.arrs){
        arr.checkArrPopulation = this.embededFuncs.checkArrPopulation
        arr.getArrPopulationRate = this.embededFuncs.getArrPopulationRate
        arr.getArrPopulationBig5Rate = this.embededFuncs.getArrPopulationBig5Rate
        for(let site of arr.sites){
          site.checkSitePopulation = this.embededFuncs.checkSitePopulation
          site.getSitePopulationRate = this.embededFuncs.getSitePopulationRate
          site.getSitePopulationBig5Rate = this.embededFuncs.getSitePopulationBig5Rate
        }
      }
    }
  }

  embedSVG(){
    let pathRegions = this.mapComponent.regions
    let pathArrs = this.mapComponent.arrs
    let polygonSites = this.mapComponent.sites
    let siteIndex = 0

    function getRegionPath(id){
      for(let path of pathRegions)
        if(path._id===id)
          return path
      console.log('region id: '+id+"does not exist")
    }
    function getArrPath(id){
      for(let path of pathArrs)
        if(path._id===id)
          return path
      console.log('arr id: '+id+"does not exist")
    }

    for(let region of this.regionPopulation){
      let regionPath = getRegionPath(region._id)
      console.log('region',region)
      regionPath.region = region
      region.path = regionPath
      for(let arr of region.arrs){
        let arrPath = getArrPath(arr.arr_id)
        arrPath.arr = arr
        arr.path = arrPath
        for(let site of arr.sites){
          let polygon = polygonSites[siteIndex++]
          polygon.setAttribute('points', this.shaping(site.lon,site.lat,1,1))
          polygon.site = site
          site.polygon = polygon
        }
      }
    }
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
