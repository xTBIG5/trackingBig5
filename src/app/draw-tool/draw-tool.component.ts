import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'tb-draw-tool',
  templateUrl: './draw-tool.component.html',
  styleUrls: ['./draw-tool.component.css']
})
export class DrawToolComponent implements OnInit {
	@Input() map: MapComponent;
	@ViewChild("svg") svg:any
	xmlns = 'http://www.w3.org/2000/svg'


	hover = ['#A9B39A','#A9B39A','#A9B39A','#A9B39A','#A9B39A','#A9B39A','#A9B39A',
	        '#A9B39A','#A9B39A','#A9B39A','#A9B39A','#A9B39A','#A9B39A','#A9B39A',]
	pathShapes = []

	colors = ['#56CCFF', '#FF6336', '#FEF248', '#9DFF74', '#D358FF',
					"#04A0E3", "#E43400", '#33AC00', '#7B00A7', '#A70000',]
	arrs = []
	pickedSites = []

	paths = []

	pickRule = 'default'

  constructor(@Inject(DOCUMENT) private  document: any) { }

  ngOnInit() {
    this.pathShapes = this.getPathShapes()

    this.map.latitude_    = 14.5;
    this.map.longitude_   = -14.5;
    this.map.y_ = 12.6 + 136.94363271933562;
    this.map.x_ = 12.6 + 186.63049838495695;
    this.map.x_x_Width    = 383.088901314467 - 186.63049838495695;
    this.map.y_y_Height   = 271.78538763862565 - 136.94363271933562;
    this.map.dlat = 2;
    this.map.dlon = 3;

    this.map.getBig5sTest(this.getCountryMapCollection)
    this.arrs = this.getArrs()
    this.showSite()

    let region = this.map.big5s[0].region
    this.paths = this.transform(this.pathShapes[region-1])

  }
	showSite(){
		for(let site of this.map.big5s){
			let polygon = this.document.createElementNS(this.xmlns,'polygon')
			polygon.setAttribute('points',this.map.shaping(site.lon, site.lat, 1, .6))
			polygon.setAttribute('fill', this.pickColor(site.arr_id))
			polygon.addEventListener('mouseenter', this.mouseenter.bind(this))
			polygon.addEventListener('mouseleave', this.mouseleave.bind(this))
			polygon.addEventListener('dblclick', this.pickSite.bind(this))
			polygon.site = site
			polygon.tool = this
			for(let arr of this.arrs)
				if(arr.arr_id===site.arr_id){
					polygon.site.arr = arr
					break
				}

			this.svg.nativeElement.appendChild(polygon)
		}
	}

	getArrs(){
		let arrs = []
		for(let site of this.map.big5s){
			let isExist = false
			for(let arr of arrs)
				if(site.arr_id===arr.arr_id){
					isExist = true
					break
				}
			if(!isExist)
				arrs.push({arr_id:site.arr_id, paths:[], pathShapes:[]})
		}console.log(arrs)
		return arrs
	}
	pickColor(arr_id){
		for(let i=0;i<this.arrs.length;i++)
			if(this.arrs[i].arr_id===arr_id)
				return this.colors[i%10]	
	}
	newPath(firstPoint){
		let point = {
					x:firstPoint.x,
					y:firstPoint.y,
					previous: null,
					next: null
				}
		let path = {
			foreward:{
				point:point,
				edgePoints:[],
				circle:null,
				polyline:null,
				add(newPoint, edgePoints=[]){
					if(this.edgePoints.length!==0){
						alert('This is edge head, choose the another head')
						return false
					}
					newPoint.previous = this.point
					this.point.next = newPoint
					this.point = newPoint
					if(edgePoints.length!==0){
						this.edgePoints = edgePoints
					}
					return true
				},
				getList(){
					let l = []
					let point = this.point
					while(point){
						l.push(point)
						point = point.previous
					}
					return l
				},
				/*addChain(chain){
					for(let point of chain.getList())
						this.add(point)
					this.isEdgePoint = path.backward.isEdgePoint
				}*/
			},
			backward:{
				point:point,
				edgePoints:[],
				circle:null,
				polyline:null,
				add(newPoint, edgePoints=[]){
					if(this.edgePoints.length!==0){
						alert('This is edge head, choose the another head')
						return false
					}
					newPoint.next = this.point
					this.point.previous = newPoint
					this.point = newPoint
					if(edgePoints.length!==0)
						this.edgePoints = edgePoints
					return true
				},
				getList(){
					let l = []
					let point = this.point
					while(point){
						l.push(point)
						point = point.next
					}
					return l
				},
				/*addChain(chain){
					for(let point of chain.getList())
						this.add(point)
					this.isEdgePoint = path.foreward.isEdgePoint
				}*/
			}
		}
		return path
	}
	newPathShapes(arr, point){
		let newPath = this.newPath(point)
		arr.paths.push(newPath)
		let polyline = this.document.createElementNS(this.xmlns,'polyline')
		polyline.colors=['#7B00A7', '#A70000',]
		polyline.colorIndex = 0
		polyline.path = newPath
		polyline.setAttribute('stroke', polyline.colors[0])
		polyline.setAttribute('fill', 'none')
		polyline.setAttribute('stroke-width', '.3')
		let newCircle = (head)=>{
			let circle = this.document.createElementNS(this.xmlns,'circle')
			circle.colors = ['#7B00A7', '#A70000',]
			circle.colorIndex = 0
			circle.arr = arr
			//circle.tool = this
			circle.moveHead = head
			circle.setAttribute('fill', circle.colors[0])
			circle.setAttribute('r', '.6')
			circle.setAttribute('cx', circle.moveHead.point.x)
			circle.setAttribute('cy', circle.moveHead.point.y)
			circle.addEventListener('dblclick', (e)=>{
				e.target.arr.moveHead = e.target.moveHead
				e.target.setAttribute('fill', e.target.colors[++e.target.colorIndex%2])
				//e.target.tool.pickedSites = []
			})

			return circle
		}
		let circle1 = newCircle(newPath.backward)
		newPath.backward.circle = circle1
		newPath.backward.polyline = polyline
		let circle2 = newCircle(newPath.foreward)
		newPath.foreward.circle = circle2
		newPath.foreward.polyline = polyline

		this.svg.nativeElement.appendChild(polyline)
		this.svg.nativeElement.appendChild(circle1)
		this.svg.nativeElement.appendChild(circle2)
		arr.pathShapes.push([polyline, circle1, circle2])
		arr.moveHead = newPath.foreward
	}


	pickSite(event){
		let site = event.target.site
		if(event.target.tool.pickRule==='default')
			for(let i=0;i<this.pickedSites.length;i++)
				if(site.arr_id===this.pickedSites[i].arr_id)
					this.pickedSites.splice(i,1)
		this.pickedSites.push(site)
	}

	reset(self){
		self.pickedSites = []
	}
	addPoint(self, site, point, edgePoints=false){
		if(!site.arr.moveHead){
			self.newPathShapes(site.arr, point)
		}else{
			if(edgePoints)
				site.arr.moveHead.add(point, edgePoints)
			else{
				if(!site.arr.moveHead.add(point))
					return
			}
			let polyline = site.arr.moveHead.polyline
			console.log(polyline)
			let points=''
			for(let point of site.arr.moveHead.getList())
				points += point.x+','+point.y+' '
			console.log('po',points)
			polyline.setAttribute('points', points)
			let circle = site.arr.moveHead.circle
			circle.setAttribute('cx', point.x)
			circle.setAttribute('cy', point.y)
		}
	}
	one(self){
		if(self.pickedSites.length!=2){
			alert("not two points, you have choose one()")
			return
		}
		let site1 = self.pickedSites[0]
		let site2 = self.pickedSites[1]
		let point = {
			x: self.map.convertToX(site1.lon),
			y: self.map.convertToY(site1.lat)
		}
		self.addPoint(self,site1,point)
		self.addPoint(self,site2,point)
		self.pickedSites = []
	}
	two(self){
		if(self.pickedSites.length!=2){
			alert("not two points, you have choose two()")
			return
		}
		let site1 = self.pickedSites[0]
		let site2 = self.pickedSites[1]
		let point = {
			x: self.map.convertToX((site1.lon+site2.lon)/2),
			y: self.map.convertToY((site1.lat+site2.lat)/2)
		}
		self.addPoint(self,site1,point)
		self.addPoint(self,site2,point)
		self.pickedSites = []
	}
	three(self){
		if(self.pickedSites.length<3){
			alert("not three points, you have choose three()")
			return
		}
		let site1 = self.pickedSites[0]
		let site2 = self.pickedSites[1]
		let site3 = self.pickedSites[2]
		let point = {
			x: self.map.convertToX((site1.lon+site2.lon)/2),
			y: self.map.convertToY((site1.lat+site2.lat)/2)
		}
		let x3 = self.map.convertToX(site3.lon)
		let y3 = self.map.convertToY(site3.lat)
		point.x += (x3-point.x)/3
		point.y += (y3-point.y)/3
		self.addPoint(self,site1,point)
		self.addPoint(self,site2,point)
		self.addPoint(self,site3,point)
		self.pickedSites = []
	}
	finish(self){
		if(self.pickedSites.length<3){
			alert(`pick more to do finish process of arr${self.pickedSites[0].arr_id}`)
			return
		}
		if(self.pickedSites.length===4){
			let regionPaths = ''
			for(let arr of self.arrs)
				regionPaths += arr.pointsP+',\n'
			console.log('print region paths')
			console.log(regionPaths)
			return
		}

		if(self.pickedSites[0].arr.paths.length===1){
			let path = self.pickedSites[0].arr.paths[0]
			let pointF = path.foreward.edgePoints[1]
			let headI = 0
			let pathI = 0
			for(let i=0;i<self.paths.length;i++)
				for(let j=0;j<self.paths[i].length;j++)
					if(self.paths[i][j].x===pointF.x && self.paths[i][j].y===pointF.y){
						headI = j
						pathI =i
					}

			let count = 0
			let pointB = path.backward.edgePoints[0]
			for(let i=headI+1;i!==headI;i++){
				count++
				if(i===self.paths[pathI].length)
					i=0
				if(self.paths[pathI][i].x===pointB.x && self.paths[pathI][i].y===pointB.y){
					if(count>self.paths[pathI].length-count){
						var points = path.foreward.getList().concat(gatherForeward(self.paths[pathI],i+1,headI-1))
					}else{
						var points = path.backward.getList().concat(gatherForeward(self.paths[pathI],headI,i))
					}
					let pointsP = ''
					for(let point of points)
						pointsP += 'L'+point.x+','+point.y
					pointsP = 'M'+pointsP.slice(1)+'Z'
					self.pickedSites[0].arr.pointsP = pointsP
					let arrShape = self.document.createElementNS(self.xmlns,'path')
					arrShape.setAttribute('d', pointsP)
					/*arrShape.setAttribute('fill', '#9BAF60')
					arrShape.setAttribute('opacity', '.7')*/
					arrShape.setAttribute('fill', 'none')
					arrShape.setAttribute('stroke-width', '.5')
					arrShape.setAttribute('stroke', '#9BAF60')

					self.svg.nativeElement.appendChild(arrShape)
					console.log('print points of arr',self.pickedSites[0].arr_id)
					console.log(`{arr_id: ${self.pickedSites[0].arr.arr_id},d: '${pointsP}'}`)
				}
			}
		}else{
			let path1 = self.pickedSites[0].arr.paths[0]
			let path2 = self.pickedSites[0].arr.paths[1]
			let point1F = path1.foreward.edgePoints[1]
			let point1B = path1.backward.edgePoints[1]
			let headFI = 0
			let pathI = 0
			for(let i=0;i<self.paths.length;i++)
				for(let j=0;j<self.paths[i].length;j++)
					if(self.paths[i][j]===point1F){
						headFI = j
						pathI =i
						break
					}
			let headBI = 0
			for(let i=0;i<self.paths.length;i++)
				for(let j=0;j<self.paths[i].length;j++)
					if(self.paths[i][j]===point1B){
						headBI = j
						break
					}

			let isForeward = true
			let point2B = path2.backward.edgePoints[0]
			let point2F = path2.foreward.edgePoints[0]
			let toAnotherPath = (headI, anotherPoint) => {
				let point1ToPath2 = {i:0,isForeward:true,direction:'foreward'}
				for(let i=headI+1;i!=headI;i++){
					if(i===self.paths[pathI].length)
						i=0
					if(self.paths[pathI][i]===anotherPoint){
						for(let j=headI-1;j!=headI;j--){
							if(i===self.paths[pathI].length)
								i=0//dfafsddfd
							if(self.paths[pathI][j]===point2B){
								point1ToPath2.i = j
								point1ToPath2.isForeward = false
								break
							}
							if(self.paths[pathI][j]===point2F){
								point1ToPath2.i = j
								break
							}
							point1ToPath2.direction = 'backward'
						}
						break
					}
					if(self.paths[pathI][i]===point2B){
						point1ToPath2.i = i
						point1ToPath2.isForeward = false
						break
					}
					if(self.paths[pathI][i]===point2F){
						point1ToPath2.i = i
						break
					}
				}
				return point1ToPath2
			}
			let point1FToPath2 = toAnotherPath(headFI,point1B)
			let point1BToPath2 = toAnotherPath(headBI,point1F)

			let points = []
			if(point1FToPath2.direction==='foreward'){
				points = path1.backward.getList().concat(gatherForeward(self.paths[pathI],headFI,point1FToPath2.i))
				let path2Points = []
				if(point1FToPath2.isForeward)
					path2Points = path2.foreward.getList()
				else
					path2Points = path2.backward.getList()
				points = points.concat(path2Points)
				points = points.concat(gatherForeward(self.paths[pathI],point1BToPath2.i+1,headBI-1))
			}else{
				points = gatherForeward(self.paths[pathI],point1FToPath2.i+1,headFI-1).concat(path1.foreward.getList())
				let path2Points = []
				if(point1FToPath2.isForeward)
					path2Points = path2.backward.getList()
				else
					path2Points = path2.foreward.getList()
				points = path2Points.concat(points)
				points = points.concat(gatherForeward(self.paths[pathI],headBI,point1BToPath2.i))
			}
			let pointsP = ''
			for(let point of points)
				pointsP += 'L'+point.x+','+point.y
			pointsP = 'M'+pointsP.slice(1)+'Z'
			self.pickedSites[0].arr.pointsP = pointsP
			let arrShape = self.document.createElementNS(self.xmlns,'path')
			arrShape.setAttribute('d', pointsP)
			/*arrShape.setAttribute('fill', '#9BAF60')
			arrShape.setAttribute('opacity', '.7')*/
			arrShape.setAttribute('fill', 'none')
			arrShape.setAttribute('stroke-width', '.5')
			arrShape.setAttribute('stroke', '#9BAF60')

			self.svg.nativeElement.appendChild(arrShape)
			console.log('print points of arr',self.pickedSites[0].arr_id)
			console.log(`{arr_id: ${self.pickedSites[0].arr.arr_id},d: '${pointsP}'}`)
		}
		function gatherForeward(path,i,j){
			let l = []
			for(;i!==j;i++){
				if(i===path.length)
					i=0
				l.push(path[i])
			}
			l.push(path[j])
			return l
		}
		for(let shapes of self.pickedSites[0].arr.pathShapes){
			self.svg.nativeElement.removeChild(shapes[0])
			self.svg.nativeElement.removeChild(shapes[1])
			self.svg.nativeElement.removeChild(shapes[2])
		}
	}
	transform(d){
		let d1 = []
		let d2 = []
		let i = 0
		while(true){
		   let j = i+1
		   let points = {}
		   while(true){
				if(d[j]=='L' || d[j]=='Z'){
					let y = parseFloat(d.slice(i+1,j))
					points['y'] = +y*.4041
					i = j
					break
				}
				if(d[j]==','){
					let x = parseFloat(d.slice(i+1,j))
					points['x'] = x*.4041
					i = j
				}
				j += 1
			}
		   d1.push(points)
		   if(d[i]=='Z')
		       if(i+1!=d.length){
		           d2 = d1
		           d1 = []
		           i += 1
		       }else
		           if(d2.length==0)
		               return [d1,]
		           else
		           	return [d2,d1]
		}
	}
	setEdgePoint(self,direction){
		if(self.pickedSites.length!==2){
			alert('pick two')
			return
		}
		let site1 = self.pickedSites[0]
		let site2 = self.pickedSites[1]

		let x = site1.arr.moveHead.point.x
		let y = site1.arr.moveHead.point.y
		let xTwoPoints = []
		let yTwoPoints = []
		for(let shape of self.paths){
			let i = 0
			while(i<shape.length-1){
			  if( (x<=shape[i]['x'] && x>=shape[i+1]['x']) || (x>=shape[i]['x'] && x<=shape[i+1]['x']) )
			      xTwoPoints.push([shape[i], shape[i+1]])
			  if( (y<=shape[i]['y'] && y>=shape[i+1]['y']) || (y>=shape[i]['y'] && y<=shape[i+1]['y']) )
			      yTwoPoints.push([shape[i], shape[i+1]])
			  i += 1
			}
		}
		function y__(points){
		  let y_ = points[0]['x'] - points[0+1]['x']
		  let x_ = points[0]['y'] - points[0+1]['y']
		  let y__ = (x_*(x-points[0]['x'])+y_*points[0]['y'])/y_
		  return y__
		 }
		function x__(points){
		  let y_ = points[0]['x'] - points[0+1]['x']
		  let x_ = points[0]['y'] - points[0+1]['y']
		  let x__ = (y_*(y-points[0]['y'])+x_*points[0]['x'])/x_
		  return x__
		}
		self.pickedSites = []
		if(direction==='N'){
			let l = {}, ys = []
			for(let points of xTwoPoints){
				let y_ = y__(points)
				if(y_<=y){
					l[y_] = points
					ys.push(y_)
				}
			}
			let y_ = 0
			for(let y__ of ys)
				if(y__>y_)
					y_ = y__
			self.addPoint(self, site1, {x:x,y:y_}, l[y_])
			self.addPoint(self, site2, {x:x,y:y_}, l[y_])
		}
		if(direction==='S'){
			let l = {}, ys = []
			for(let points of xTwoPoints){
				let y_ = y__(points)
				if(y_>=y){
					l[y_] = points
					ys.push(y_)
				}
			}
			let y_ = ys[0]
			for(let y__ of ys)
				if(y__<y_)
					y_ = y__
			self.addPoint(self, site1, {x:x,y:y_}, l[y_])
			self.addPoint(self, site2, {x:x,y:y_}, l[y_])
		}
		if(direction==='E'){
			let l = {}, xs = []
			for(let points of yTwoPoints){
				let x_ = x__(points)
				if(x_>=x){
					l[x_] = points
					xs.push(x_)
				}
			}
			let x_ = xs[0]
			for(let x__ of xs)
				if(x__<x_)
					x_ = x__
			self.addPoint(self, site1, {x:x_,y:y}, l[x_])
			self.addPoint(self, site2, {x:x_,y:y}, l[x_])
		}
		if(direction==='W'){
			let l = {}, xs = []
			for(let points of yTwoPoints){
				let x_ = x__(points)
				if(x_<=x){
					l[x_] = points
					xs.push(x_)
				}
			}
			let x_ = xs[0]
			for(let x__ of xs)
				if(x__>x_)
					x_ = x__
			self.addPoint(self, site1, {x:x_,y:y}, l[x_])
			self.addPoint(self, site2, {x:x_,y:y}, l[x_])
		}
	}
	toNorth(self){
		self.setEdgePoint(self,'N')
	}
	toWest(self){
		self.setEdgePoint(self,'W')
	}
	toEast(self){
		self.setEdgePoint(self,'E')
	}
	toSouth(self){
		self.setEdgePoint(self,'S')
	}
	toFront(self){
		if(self.pickedSites.length===0){
			alert('pick arr')
			return
		}
		let pathShapes = self.pickedSites[0].arr.pathShapes
		for(let shapes of pathShapes){
			this.svg.nativeElement.appendChild(shapes[0])
			this.svg.nativeElement.appendChild(shapes[1])
			this.svg.nativeElement.appendChild(shapes[2])
		}
		self.pickedSites = []
	}
	changePickRule(e, self){
		if(self.pickRule==='default'){
			e.target.setAttribute('fill',"#A70000")
			self.pickRule = 'line to edge'
		}
		else if(self.pickRule==='line to edge'){
			e.target.setAttribute('fill',"#FFF")
			self.pickRule = 'default'
		}
	}
	morePath(self){
		self.pickedSites[0].arr.moveHead = null
		alert(`you have setup for a new path of arr${self.pickedSites[0].arr_id}`)
		self.pickedSites = []
	}
	lineToEdge(self){

	}



	mouseenter(event){
		let site = event.target.site
		event.target.setAttribute('points',this.map.shaping(site.lon, site.lat, 1, 1))
	}
	mouseleave(event){
		let site = event.target.site
		event.target.setAttribute('points',this.map.shaping(site.lon, site.lat, 1, .6))
	}
	right(e){
		let svg = e.target.parentElement
		svg.setAttribute('x', svg.getAttribute('x')-(-4))
	}
	left(e){
		let svg = e.target.parentElement
		svg.setAttribute('x', svg.getAttribute('x')-4)
	}
	down(e){
		let svg = e.target.parentElement
		svg.setAttribute('y', svg.getAttribute('y')-(-4))
	}
	up(e){
		let svg = e.target.parentElement
		svg.setAttribute('y', svg.getAttribute('y')-4)
	}
















  rounding(l){
    /*let l = []
    let arr_id = this.map.big5s[0].arr_id
    for(let big5 of this.map.big5s)
      if(arr_id===big5.arr_id)
        l.push(big5)*/

    for(let big5 of l){
      big5.x = this.map.convertToX(big5.lon)
      big5.y = this.map.convertToY(big5.lat)
    }

    let northestBig5 = l[0]
    for(let big5 of l)
      if(northestBig5.y>big5.y)
        northestBig5 = big5

    let southestBig5 = l[0]
    for(let big5 of l)
      if(southestBig5.y<big5.y)
        southestBig5 = big5

    let i =0
    while(l[i]===northestBig5 || l[i]===southestBig5)
      i++
    let westestBig5 = l[i]
    for(let big5 of l)
      if(westestBig5.x>big5.x && big5!==northestBig5 && big5!==southestBig5)
        westestBig5 = big5

    let boundBig5s = []
    boundBig5s.push(westestBig5)
    console.log('west',westestBig5)

    let edgeBig5  = westestBig5
    edgingUP(northestBig5)

    console.log('south', southestBig5)
    console.log("noth",northestBig5)
    boundBig5s.push(northestBig5)
    edgeBig5 = northestBig5
    edgingDown()
    boundBig5s.push(southestBig5)
    edgeBig5 = southestBig5
    edgingUP(westestBig5)

    return boundBig5s

    function edgingUP(delimit){
      while(edgeBig5!==delimit){
        let [nearestBig5, nearestEdgeBig5] = twoNearestBig5s(edgeBig5,'up')
        
        if(nearestEdgeBig5){
          //identify detaile of arrondissement boundary
          if(nearestEdgeBig5.y>=nearestBig5.y || (nearestBig5.y-nearestEdgeBig5.y)<(edgeBig5.y-nearestBig5.y)/2){
            boundBig5s.push(nearestEdgeBig5)
            edgeBig5 = nearestEdgeBig5
            continue
          }
          /*else if(){
            boundBig5s.push(nearestEdgeBig5)
            edgeBig5 = nearestEdgeBig5
            continue
          }*/
        }
        boundBig5s.push(nearestBig5)
        edgeBig5 = nearestBig5
        
      }
    }

    function edgingDown(){
      while(edgeBig5!==southestBig5){
        let [nearestBig5, nearestEdgeBig5] = twoNearestBig5s(edgeBig5,'down')
        if(nearestEdgeBig5)
        //identify detaile of arrondissement boundary
          if(nearestEdgeBig5.y<=nearestBig5.y || (-nearestBig5.y+nearestEdgeBig5.y)<-(edgeBig5.y-nearestBig5.y)/2){
            boundBig5s.push(nearestEdgeBig5)
            edgeBig5 = nearestEdgeBig5
            continue
          }
        //identify detaile of arrondissement boundary
        /*else if(){
          boundBig5s.push(nearestEdgeBig5)
          edgeBig5 = nearestEdgeBig5
        }*/
        boundBig5s.push(nearestBig5)
        edgeBig5 = nearestBig5
      }
    }

    function twoNearestBig5s(big5_root,direction){
      let distantList = []
      let c1=0
      let c2=0
      if(direction==='up')
        for(let big5 of l){
          if(big5!==big5_root && big5.y<=big5_root.y){
            c1++
            distantList.push(big5)
            big5.distant = Math.pow((big5.x-big5_root.x),2)+Math.pow((big5.y-big5_root.y),2)
          }
        }
      else
        for(let big5 of l)
          if(big5!==big5_root && big5.y>=big5_root.y){
            c2++
            distantList.push(big5)
            big5.distant = Math.pow((big5.x-big5_root.x),2)+Math.pow((big5.y-big5_root.y),2)
          }
      let nearestBig5 = distantList[0]
      for(let big5 of distantList)
        if(big5.distant<nearestBig5.distant)
          nearestBig5 = big5

      let edgeList = []
      if(direction==='up'){
        for(let big5 of distantList)
          if(big5.x<nearestBig5.x)
            edgeList.push(big5)
      }else
        for(let big5 of distantList)
          if(big5.x>nearestBig5.x)
            edgeList.push(big5)
      let nearestEdgeBig5 = edgeList[0]
      if(direction==='up'){
        for(let big5 of edgeList)
          if(nearestEdgeBig5.y<big5.y)
            nearestEdgeBig5 = big5
      }else
        for(let big5 of edgeList)
          if(nearestEdgeBig5.y>big5.y)
            nearestEdgeBig5 = big5
      return [nearestBig5, nearestEdgeBig5]
    }


  }

  testArr(){
    let big5s = []
    for(let big5 of this.map.big5s){
      if(big5.arr_id%6===2){
        big5.O = 3
        big5.C = 1
        big5.E = 1
        big5.A = 1
        big5.N = 1
      }
      if(big5.arr_id%6===3){
        big5.O = 1
        big5.C = 3
        big5.E = 1
        big5.A = 1
        big5.N = 1
      }
      if(big5.arr_id%6===4){
        big5.O = 1
        big5.C = 1
        big5.E = 3
        big5.A = 1
        big5.N = 1
      }
      if(big5.arr_id%6===5){
        big5.O = 1
        big5.C = 1
        big5.E = 1
        big5.A = 3
        big5.N = 1
      }
      if(big5.arr_id%6===0){
          big5.O = 1
          big5.C = 1
          big5.E = 1
          big5.A = 1
          big5.N = 3
        }
      if(big5.arr_id%6===1){
        big5.O = 1
        big5.C = 3
        big5.E = 1
        big5.A = 1
        big5.N = 3
      }
     /* big5s.push(big5)}
    console.log(big5s.length)
    return big5s*/
    }
  }

  getCountryMapCollection(collection){

    return collection
  }


  getPathShapes(){
    let d1="M914.4,556.9L914.8,558.6999999999999L916.1999999999999,559.0999999999999L920.4999999999999,561.1999999999999L921.6999999999999,562.1999999999999L922.3,563.4L923.4,566.6L924.1,567.8000000000001L926,569.4000000000001L926.9,569.5000000000001L927.8,568.5000000000001L934.5999999999999,563.4000000000001L934.9999999999999,560.1000000000001L935.9999999999999,556.7000000000002L937.5999999999999,554.0000000000001L940.0999999999999,552.6000000000001L942.3999999999999,553.0000000000001L943.5999999999999,554.3000000000001L944.4999999999999,555.9000000000001L946.0999999999999,557.2L947.6999999999999,557.4000000000001L950.8,556.7L954.9,556.6L955.6999999999999,557.3000000000001L955.4,559.7L955.9,561.3000000000001L957.6999999999999,561.5000000000001L959.6999999999999,561.0000000000001L960.9,560.5000000000001L960.9,564.1000000000001L962,567.3000000000002L966,572.9000000000002L969.7,576.2000000000002L970.4000000000001,577.8000000000002L970.1000000000001,579.6000000000001L968.1000000000001,582.6000000000001L967.5000000000001,584.4000000000001L968.0000000000001,587.4000000000001L969.5000000000001,589.4000000000001L971.4000000000001,591.2L972.9000000000001,593.4000000000001L973.0000000000001,599.2L973.8000000000001,601.9000000000001L976.7,602.6000000000001L978.9000000000001,604.0000000000001L980.9000000000001,605.4000000000001L982.9000000000001,606.7L985.5000000000001,607.4000000000001L987.3000000000001,608.1000000000001L987.1,609.2000000000002L986.2,610.5000000000001L985.8000000000001,611.5000000000001L988.1,614.7000000000002L989,616.7000000000002L989.6,617.8000000000002L990.3000000000001,618.3000000000002L991.7,619.0000000000002L991.4000000000001,619.7000000000003L990.0000000000001,621.1000000000003L990.0000000000001,622.5000000000002L989.6000000000001,625.7000000000003L989.1000000000001,627.4000000000003L991.7000000000002,627.9000000000003L993.5000000000001,627.1000000000004L994.7000000000002,625.2000000000004L995.1000000000001,622.3000000000004L996.5000000000001,623.8000000000004L997.2000000000002,625.5000000000005L997.6000000000001,627.4000000000004L997.9000000000001,631.7000000000004L997.4000000000001,632.7000000000004L996.3000000000001,633.3000000000004L994.9000000000001,634.5000000000005L994.2,634.5000000000005L992,633.5000000000005L991,634.1000000000005L990.9,635.1000000000005L992.6,636.9000000000004L992.9,637.8000000000004L992.3,639.5000000000005L991.4,641.2000000000005L990.8,642.9000000000005L991.3,645.6000000000006L990.0999999999999,647.9000000000005L990.1999999999999,649.0000000000006L992.1999999999999,649.7000000000006L993.4999999999999,651.7000000000006L993.9999999999999,653.1000000000006L994.3999999999999,654.8000000000006L994.4999999999999,656.8000000000006L994.1999999999999,658.6000000000006L992.9999999999999,659.8000000000006L992.9999999999999,660.5000000000007L994.6999999999999,663.6000000000007L994.9999999999999,665.2000000000007L993.6999999999999,667.3000000000008L991.4999999999999,667.7000000000007L989.2999999999998,668.4000000000008L987.5999999999998,672.8000000000008L986.3999999999997,673.7000000000007L985.3999999999997,674.9000000000008L985.4999999999998,677.4000000000008L987.3999999999997,678.3000000000008L988.5999999999998,679.2000000000007L989.3999999999997,680.9000000000008L989.4999999999998,682.6000000000008L988.5999999999998,687.8000000000009L988.7999999999998,689.6000000000008L989.2999999999998,692.0000000000008L988.8999999999999,693.9000000000008L985.5999999999999,695.4000000000008L984.3999999999999,696.5000000000008L986.1999999999998,697.1000000000008L987.3999999999999,697.9000000000008L989.2999999999998,701.2000000000007L990.5999999999998,702.3000000000008L990.4999999999998,701.1000000000007L991.3999999999997,699.3000000000008L992.5999999999998,698.8000000000008L993.5999999999998,701.5000000000008L993.9999999999998,702.9000000000008L994.9999999999998,705.6000000000008L995.2999999999997,707.1000000000008L996.5999999999997,705.1000000000008L996.8999999999996,704.1000000000008L998.9999999999997,707.0000000000008L998.6999999999997,710.9000000000008L997.5999999999997,715.3000000000008L997.2999999999997,719.7000000000007L992.7999999999997,719.5000000000007L982.1999999999997,715.6000000000007L976.6999999999997,715.1000000000007L962.6999999999997,716.1000000000007L955.9999999999997,717.4000000000007L943.4999999999997,722.1000000000007L937.3999999999996,723.1000000000007L924.1999999999996,722.5000000000007L920.7999999999996,721.8000000000006L910.9999999999997,717.7000000000006L910.4999999999997,717.2000000000006L909.3999999999996,717.2000000000006L908.6999999999996,717.5000000000006L906.8999999999996,718.8000000000005L900.6999999999996,722.1000000000005L898.5999999999996,722.6000000000005L895.0999999999996,722.2000000000005L885.2999999999996,719.0000000000005L881.2999999999996,719.1000000000005L878.3999999999996,720.5000000000005L872.9999999999997,725.5000000000005L866.9999999999997,728.8000000000004L839.6999999999997,736.0000000000005L836.9999999999997,734.7000000000005L832.3999999999996,727.6000000000005L829.4999999999997,725.5000000000005L822.4999999999997,722.9000000000004L819.0999999999997,722.1000000000005L816.2999999999997,721.9000000000004L813.5999999999997,722.5000000000005L810.3999999999996,723.7000000000005L805.6999999999996,726.4000000000005L804.2999999999996,726.8000000000005L801.9999999999997,726.7000000000005L801.3999999999996,726.1000000000005L801.1999999999996,724.9000000000004L800.3999999999996,723.3000000000004L795.7999999999996,718.2000000000004L793.0999999999996,716.0000000000003L789.9999999999995,714.7000000000004L786.6999999999996,714.3000000000004L776.1999999999996,714.9000000000004L772.7999999999996,714.5000000000005L771.8999999999996,713.1000000000005L771.1999999999996,711.5000000000005L768.5999999999996,710.3000000000004L763.7999999999996,709.9000000000004L762.2999999999996,709.3000000000004L760.5999999999996,707.7000000000004L760.1999999999996,706.3000000000004L760.4999999999995,704.5000000000005L756.4999999999995,701.0000000000005L750.1999999999996,697.7000000000005L744.2999999999996,697.7000000000005L741.5999999999996,704.4000000000005L740.9999999999995,707.6000000000006L739.1999999999996,709.2000000000006L736.4999999999995,709.4000000000007L733.5999999999996,708.3000000000006L730.4999999999995,708.6000000000006L727.6999999999996,708.3000000000006L725.2999999999996,707.0000000000007L723.3999999999996,704.3000000000006L722.6999999999996,701.1000000000006L723.2999999999996,698.4000000000005L725.6999999999996,692.7000000000005L726.2999999999996,689.9000000000005L726.4999999999997,686.5000000000006L725.7999999999996,683.4000000000005L723.6999999999996,681.1000000000006L721.1999999999996,680.7000000000006L718.3999999999996,681.2000000000006L715.4999999999997,681.3000000000006L712.5999999999997,679.8000000000006L710.9999999999997,681.6000000000006L709.6999999999997,680.8000000000006L708.6999999999997,680.7000000000006L706.0999999999997,680.8000000000006L703.3999999999996,681.5000000000007L702.5999999999997,681.2000000000007L701.0999999999997,679.5000000000007L700.1999999999997,679.1000000000007L698.9999999999997,679.1000000000007L696.1999999999997,679.9000000000007L694.7999999999997,680.1000000000007L693.3999999999997,679.9000000000007L691.3999999999997,678.6000000000007L690.0999999999998,678.2000000000007L688.5999999999998,678.3000000000008L683.7999999999998,679.4000000000008L682.9999999999999,679.6000000000008L682.1999999999999,680.5000000000008L681.1999999999999,680.6000000000008L680.4,680.3000000000009L679.1,679.3000000000009L677.8000000000001,678.8000000000009L678.3000000000001,676.2000000000008L677.0000000000001,673.0000000000008L674.9000000000001,672.0000000000008L673.9000000000001,672.2000000000008L671.9000000000001,673.1000000000008L670.1000000000001,673.4000000000008L666.4000000000001,673.4000000000008L664.3000000000001,673.1000000000008L662.6,672.4000000000008L660.5,671.4000000000008L659.3,670.4000000000008L658.1999999999999,669.0000000000008L657.9,668.0000000000008L658.1,667.1000000000008L658.9,665.7000000000008L659.1,664.8000000000009L659.5,658.7000000000008L659.3,657.7000000000008L658.4,655.2000000000008L657.3,654.0000000000008L656.8,651.8000000000008L657.4,650.2000000000007L658.8,648.0000000000007L658.8,647.1000000000007L657.5999999999999,645.8000000000008L657.9999999999999,645.1000000000007L659.7999999999998,645.2000000000007L660.4999999999999,644.8000000000008L660.6999999999999,643.7000000000007L660.0999999999999,642.5000000000007L659.3999999999999,638.6000000000007L658.6999999999998,637.9000000000007L656.4999999999998,636.4000000000007L654.9999999999998,634.7000000000006L654.4999999999998,633.3000000000006L653.8999999999997,630.7000000000006L653.0999999999998,629.6000000000006L652.7999999999998,628.6000000000006L653.8999999999999,626.3000000000006L653.1999999999998,621.2000000000006L652.1999999999998,620.2000000000006L650.0999999999998,619.5000000000006L649.7999999999998,618.8000000000005L650.3999999999999,617.4000000000005L650.6999999999998,616.4000000000005L650.2999999999998,615.7000000000005L649.1999999999998,614.6000000000005L647.9999999999998,613.0000000000005L646.1999999999998,611.1000000000005L643.6999999999998,609.5000000000005L643.2999999999998,608.7000000000005L643.3999999999999,605.6000000000005L640.9999999999999,603.8000000000005L638.8999999999999,601.3000000000005L637.6999999999998,598.9000000000005L637.4999999999998,597.3000000000005L637.2999999999997,594.6000000000005L636.5999999999997,593.3000000000005L636.4999999999997,592.3000000000005L636.8999999999996,590.3000000000005L636.7999999999996,587.7000000000005L636.9999999999997,586.5000000000005L636.7999999999996,582.9000000000004L636.3999999999996,581.8000000000004L635.8999999999996,581.0000000000005L635.1999999999996,580.6000000000005L635.0999999999996,579.1000000000005L638.8999999999995,577.3000000000005L638.9999999999995,568.4000000000005L641.6999999999996,566.4000000000005L641.1999999999996,569.2000000000005L642.1999999999996,570.4000000000005L644.0999999999996,571.0000000000006L645.6999999999996,570.7000000000006L646.5999999999996,568.7000000000006L647.3999999999995,567.7000000000006L649.7999999999995,566.5000000000006L652.9999999999995,565.6000000000006L655.0999999999996,566.3000000000006L653.9999999999995,569.9000000000007L656.0999999999996,569.0000000000007L657.4999999999995,565.1000000000007L658.9999999999995,564.2000000000007L665.5999999999996,564.2000000000007L671.7999999999996,565.4000000000008L673.7999999999996,564.5000000000008L675.4999999999997,563.5000000000008L676.9999999999997,563.8000000000008L678.4999999999997,566.4000000000008L676.8999999999996,569.1000000000008L675.5999999999997,570.6000000000008L674.8999999999996,572.0000000000008L674.9999999999997,574.5000000000008L676.0999999999997,577.1000000000008L676.1999999999997,578.5000000000008L676.7999999999997,579.1000000000008L678.9999999999998,579.0000000000008L679.8999999999997,580.6000000000008L682.0999999999998,581.9000000000008L682.8999999999997,582.5000000000008L682.9999999999998,583.3000000000008L682.3999999999997,584.8000000000008L683.3999999999997,586.5000000000008L683.9999999999998,588.7000000000008L683.2999999999997,591.0000000000008L682.9999999999998,593.2000000000008L685.0999999999998,595.0000000000008L678.4999999999998,597.4000000000008L678.4999999999998,598.4000000000008L681.7999999999997,599.9000000000008L682.3999999999997,604.0000000000008L682.0999999999998,609.0000000000008L682.8999999999997,613.3000000000008L685.9999999999998,616.9000000000008L689.1999999999998,617.8000000000008L696.2999999999998,615.7000000000007L700.8999999999999,613.9000000000008L703.2999999999998,613.9000000000008L707.9999999999999,614.4000000000008L712.2999999999998,615.9000000000008L715.1999999999998,618.3000000000008L717.9999999999998,618.3000000000008L719.3999999999997,615.9000000000008L720.8999999999997,614.4000000000008L724.1999999999997,614.4000000000008L730.8999999999997,611.0000000000008L739.8999999999997,611.0000000000008L743.1999999999997,612.4000000000008L746.0999999999997,615.4000000000008L748.4999999999997,615.4000000000008L752.2999999999996,619.3000000000008L756.4999999999997,622.2000000000007L759.8999999999996,623.2000000000007L761.2999999999996,620.7000000000007L761.2999999999996,618.8000000000008L762.6999999999996,617.3000000000008L765.5999999999996,617.3000000000008L767.9999999999995,616.3000000000008L768.3999999999995,613.4000000000008L769.8999999999995,611.9000000000008L773.1999999999995,612.4000000000008L775.5999999999995,613.4000000000008L777.8999999999994,612.9000000000008L777.8999999999994,610.0000000000008L779.3999999999994,607.1000000000008L783.1999999999994,604.6000000000008L785.5999999999993,601.7000000000008L784.5999999999993,597.8000000000009L784.5999999999993,593.9000000000009L786.9999999999993,591.9000000000009L790.2999999999993,591.4000000000009L793.5999999999992,591.4000000000009L796.4999999999992,590.0000000000009L798.3999999999992,588.5000000000009L803.0999999999992,591.4000000000009L806.9999999999992,591.9000000000009L812.1999999999992,590.4000000000009L814.9999999999992,588.5000000000009L816.8999999999992,585.1000000000009L817.3999999999992,581.6000000000009L819.2999999999992,579.200000000001L822.5999999999991,578.700000000001L823.5999999999991,576.300000000001L825.9999999999991,574.300000000001L830.299999999999,573.300000000001L834.099999999999,574.300000000001L836.399999999999,577.200000000001L838.2999999999989,578.700000000001L840.1999999999989,578.200000000001L841.1999999999989,575.300000000001L842.5999999999989,573.300000000001L843.5999999999989,569.400000000001L845.4999999999989,568.400000000001L850.6999999999989,569.400000000001L854.9999999999989,569.400000000001L857.3999999999988,566.500000000001L856.3999999999988,562.600000000001L851.6999999999988,556.7000000000011L850.6999999999988,553.8000000000011L853.0999999999988,551.3000000000011L853.0999999999988,547.4000000000011L856.8999999999987,545.9000000000011L861.6999999999987,548.9000000000011L865.8999999999987,552.3000000000011L870.6999999999987,554.7000000000011L875.3999999999987,557.7000000000011L881.1999999999987,559.100000000001L885.3999999999987,560.600000000001L886.3999999999987,564.000000000001L887.2999999999987,567.900000000001L890.6999999999987,567.900000000001L894.8999999999987,565.000000000001L899.1999999999987,560.100000000001L904.8999999999987,558.600000000001L914.3999999999987,556.900000000001Z"
    let d2="M348.1,491.9L341.3,497L336.2,502.5L334.4,505.3L332.7,508.8L331.5,512.5L330.9,515.9L330.59999999999997,522.5L327.99999999999994,523.4L299.8999999999999,523.3L249.5999999999999,523.0999999999999L236.0999999999999,522.9999999999999L235.5999999999999,521.7999999999998L234.6999999999999,518.5999999999998L232.49999999999991,515.6999999999998L227.1999999999999,510.8999999999998L225.8999999999999,509.1999999999998L224.9999999999999,507.5999999999998L224.3999999999999,505.1999999999998L223.6999999999999,499.6999999999998L222.99999999999991,497.49999999999983L221.99999999999991,496.1999999999998L220.79999999999993,495.29999999999984L218.19999999999993,493.6999999999998L213.09999999999994,489.3999999999998L211.49999999999994,487.7999999999998L210.89999999999995,486.2999999999998L210.69999999999996,484.8999999999998L210.79999999999995,482.49999999999983L211.39999999999995,480.1999999999998L212.29999999999995,479.0999999999998L214.69999999999996,477.0999999999998L216.49999999999997,474.5999999999998L217.29999999999998,473.3999999999998L217.79999999999998,472.0999999999998L217.89999999999998,469.4999999999998L216.09999999999997,458.0999999999998L214.99999999999997,456.3999999999998L212.99999999999997,454.5999999999998L209.69999999999996,450.2999999999998L209.59999999999997,448.8999999999998L210.19999999999996,447.5999999999998L211.89999999999995,445.1999999999998L212.39999999999995,443.8999999999998L212.59999999999994,442.0999999999998L212.49999999999994,439.8999999999998L211.79999999999995,436.2999999999998L210.69999999999996,434.4999999999998L209.59999999999997,433.0999999999998L207.39999999999998,431.1999999999998L202.7,428.1999999999998L200.89999999999998,426.99999999999983L199.99999999999997,426.79999999999984L189.59999999999997,426.49999999999983L190.79999999999995,425.6999999999998L188.29999999999995,425.5999999999998L190.59999999999997,422.3999999999998L192.29999999999995,416.7999999999998L200.39999999999995,404.5999999999998L204.79999999999995,399.2999999999998L206.69999999999996,397.69999999999976L208.29999999999995,396.89999999999975L213.49999999999994,396.4999999999998L223.29999999999995,394.2999999999998L231.59999999999997,393.5999999999998L232.99999999999997,393.6999999999998L232.99999999999997,394.5999999999998L233.89999999999998,395.2999999999998L247.7,397.69999999999976L251,396.4999999999998L254,393.39999999999975L257.4,391.7999999999997L265.29999999999995,392.1999999999997L277.4,392.5999999999997L282.5,389.3999999999997L282.3,405.4999999999997L279.3,412.7999999999997L275.2,421.89999999999975L273.4,427.9999999999998L273.4,447.39999999999975L280.5,448.59999999999974L282.9,451.69999999999976L283.4,455.89999999999975L285.2,459.59999999999974L291.09999999999997,465.59999999999974L298.09999999999997,469.89999999999975L298.7,474.09999999999974L297,478.39999999999975L297,482.59999999999974L299.3,487.39999999999975L304,492.2999999999997L308.1,494.09999999999974L311.1,492.89999999999975L314,488.09999999999974L317.5,482.59999999999974L328.7,487.39999999999975L335.2,488.09999999999974L339.9,488.09999999999974L348.09999999999997,491.89999999999975Z"
    let d3="M593.1,536.6L596.7,535L599.4000000000001,534.7L600.0000000000001,534.1L600.6000000000001,532.5L601.7000000000002,531.3L602.5000000000001,531.0999999999999L604.2000000000002,531.3L606.0000000000001,531.3L606.7000000000002,531.5999999999999L607.2000000000002,532.1999999999999L607.0000000000001,533.1999999999999L606.4000000000001,534.9L606.4000000000001,536.5L606.2,537.3L605.1,538.8L604.8000000000001,539.5999999999999L604.8000000000001,540.5999999999999L605.2,541.4999999999999L606.3000000000001,542.3999999999999L607.3000000000001,542.4999999999999L608.2,542.2999999999998L609.6,541.3999999999999L611.3000000000001,540.8999999999999L613.2,541.1999999999998L615.6,542.0999999999998L617.3000000000001,542.5999999999998L618.0000000000001,543.2999999999998L617.2000000000002,544.7999999999998L614.2000000000002,547.7999999999998L613.4000000000002,549.1999999999998L613.2000000000002,550.0999999999998L613.2000000000002,553.0999999999998L613.0000000000001,553.9999999999998L611.2000000000002,556.6999999999998L611.0000000000001,557.3999999999999L611.3000000000001,558.1999999999998L612.3000000000001,558.6999999999998L614.4000000000001,559.1999999999998L616.4000000000001,559.0999999999998L620.4000000000001,558.3999999999997L622.5000000000001,558.2999999999997L623.4000000000001,558.5999999999997L623.9000000000001,559.0999999999997L623.9000000000001,560.1999999999997L623.5000000000001,560.9999999999997L622.1000000000001,562.9999999999997L621.9000000000001,563.7999999999996L622.3000000000001,564.4999999999997L624.1,565.6999999999997L624.6,566.3999999999997L624.7,567.7999999999997L624.1,570.5999999999997L624.2,571.5999999999997L624.9000000000001,572.4999999999997L626.5000000000001,573.5999999999997L628.8000000000001,574.4999999999997L629.5000000000001,574.9999999999997L630.0000000000001,575.8999999999996L630.5000000000001,578.4999999999997L631.0000000000001,579.4999999999997L632.2000000000002,580.3999999999996L633.2000000000002,580.5999999999997L635.2000000000002,580.5999999999997L635.9000000000002,580.9999999999997L636.4000000000002,581.7999999999996L636.8000000000002,582.8999999999996L637.0000000000002,586.4999999999997L636.8000000000002,587.6999999999997L636.9000000000002,590.2999999999997L636.5000000000002,592.2999999999997L636.6000000000003,593.2999999999997L637.3000000000003,594.5999999999997L637.5000000000003,597.2999999999997L637.7000000000004,598.8999999999997L638.9000000000004,601.2999999999997L641.0000000000005,603.7999999999997L643.4000000000004,605.5999999999997L643.3000000000004,608.6999999999997L643.7000000000004,609.4999999999997L646.2000000000004,611.0999999999997L648.0000000000003,612.9999999999997L649.2000000000004,614.5999999999997L650.3000000000004,615.6999999999997L650.7000000000004,616.3999999999997L650.4000000000004,617.3999999999997L649.8000000000004,618.7999999999997L650.1000000000004,619.4999999999998L652.2000000000004,620.1999999999998L653.2000000000004,621.1999999999998L653.9000000000004,626.2999999999998L652.8000000000004,628.5999999999998L653.1000000000004,629.5999999999998L653.9000000000003,630.6999999999998L654.5000000000003,633.2999999999998L655.0000000000003,634.6999999999998L656.5000000000003,636.3999999999999L658.7000000000004,637.8999999999999L659.4000000000004,638.5999999999999L660.1000000000005,642.4999999999999L660.7000000000005,643.6999999999999L660.5000000000005,644.8L659.8000000000004,645.1999999999999L658.0000000000005,645.0999999999999L657.6000000000005,645.8L658.8000000000005,647.0999999999999L658.8000000000005,647.9999999999999L657.4000000000005,650.1999999999999L656.8000000000005,651.8L657.3000000000005,654L658.4000000000005,655.2L659.3000000000005,657.7L659.5000000000006,658.7L659.1000000000006,664.8000000000001L658.9000000000005,665.7L658.1000000000006,667.1L657.9000000000005,668L658.2000000000005,669L659.3000000000005,670.4L660.5000000000006,671.4L662.6000000000006,672.4L664.3000000000006,673.1L666.4000000000007,673.4L670.1000000000007,673.4L671.9000000000007,673.1L673.9000000000007,672.2L674.9000000000007,672L677.0000000000007,673L678.3000000000006,676.2L677.8000000000006,678.8000000000001L670.5000000000007,676.8000000000001L618.1000000000007,674.9000000000001L503.2000000000007,674.4000000000001L445.7000000000007,674.2L388.30000000000075,673.9000000000001L387.00000000000074,663.7L388.4000000000007,658.8000000000001L390.8000000000007,653.5000000000001L390.8000000000007,639.8000000000001L387.9000000000007,634.9000000000001L384.6000000000007,631.0000000000001L384.1000000000007,625.1000000000001L384.6000000000007,620.7000000000002L378.9000000000007,616.8000000000002L373.7000000000007,613.4000000000002L373.2000000000007,609.5000000000002L372.7000000000007,604.1000000000003L369.4000000000007,595.3000000000003L367.00000000000074,591.4000000000003L359.4000000000007,590.0000000000003L353.7000000000007,586.0000000000003L352.7000000000007,580.2000000000004L354.6000000000007,573.8000000000004L356.1000000000007,567.5000000000005L356.5000000000007,560.2000000000005L361.8000000000007,559.2000000000005L367.1000000000007,557.2000000000005L371.7000000000007,554.1000000000005L375.1000000000007,549.7000000000005L376.1000000000007,545.1000000000005L376.7000000000007,534.8000000000005L378.9000000000007,531.1000000000005L386.00000000000074,523.7000000000005L389.7000000000007,522.2000000000005L394.1000000000007,525.1000000000005L401.4000000000007,532.0000000000005L409.50000000000074,538.0000000000005L420.10000000000076,543.4000000000004L425.60000000000076,544.8000000000004L431.80000000000075,545.4000000000004L434.30000000000075,546.1000000000005L439.7000000000007,549.4000000000004L442.6000000000007,550.4000000000004L446.0000000000007,551.0000000000005L447.70000000000067,552.1000000000005L451.0000000000007,556.7000000000005L455.5000000000007,560.8000000000005L460.90000000000066,563.1000000000005L466.80000000000064,563.8000000000005L472.80000000000064,563.1000000000005L478.10000000000065,561.7000000000005L479.90000000000066,562.4000000000005L486.10000000000065,568.1000000000006L488.20000000000067,569.4000000000005L490.60000000000065,570.1000000000006L495.70000000000067,570.3000000000006L497.8000000000007,570.9000000000007L499.6000000000007,572.8000000000006L500.9000000000007,574.4000000000007L502.4000000000007,575.8000000000006L504.1000000000007,577.0000000000007L510.0000000000007,580.1000000000007L514.3000000000006,581.3000000000008L518.7000000000006,581.6000000000007L527.9000000000007,580.8000000000008L536.7000000000006,582.5000000000008L541.4000000000007,582.3000000000008L544.9000000000007,580.6000000000007L552.7000000000006,574.7000000000007L555.1000000000006,573.6000000000007L557.9000000000005,573.6000000000007L564.9000000000005,571.1000000000007L571.4000000000005,571.0000000000007L577.9000000000005,569.2000000000007L590.2000000000005,568.2000000000007L598.2000000000005,564.6000000000007L602.8000000000005,557.6000000000007L603.4000000000005,549.0000000000007L599.5000000000006,541.1000000000007L597.9000000000005,539.8000000000008L594.2000000000005,537.6000000000007L593.1000000000005,536.6000000000007Z"
    let d4="M236.1,523L229.5,523L158.9,522.7L157.3,520.3000000000001L156.5,518.5000000000001L156.6,513.8000000000001L159.4,511.20000000000005L163.5,509.1L167.6,505.90000000000003L166.7,505.40000000000003L165,504.1L164.2,503.70000000000005L166.2,501.70000000000005L167.7,499.20000000000005L167.5,497.1L164.2,496.70000000000005L164.6,499.40000000000003L163.79999999999998,502.70000000000005L162.1,504.90000000000003L159.7,504.70000000000005L158.6,508.20000000000005L156.1,510.6L152.9,511.5L149.8,510.5L146.9,507.5L146.20000000000002,504.5L147.60000000000002,497.9L147.90000000000003,493.79999999999995L148.30000000000004,492.09999999999997L149.80000000000004,489.9L155.50000000000003,483L156.50000000000003,480.7L157.50000000000003,481.3L160.00000000000003,482.5L160.60000000000002,482.3L159.70000000000002,479.5L165.4,478.5L165.6,481.8L166.79999999999998,484.90000000000003L168.6,486.8L171,486.40000000000003L169.8,482.6L169.5,478.40000000000003L168.8,475.00000000000006L166.4,473.80000000000007L167.20000000000002,471.6000000000001L170.70000000000002,456.00000000000006L171.00000000000003,453.30000000000007L167.50000000000003,458.50000000000006L166.00000000000003,461.80000000000007L164.70000000000002,468.70000000000005L163.00000000000003,472.80000000000007L160.90000000000003,475.6000000000001L158.70000000000005,475.00000000000006L157.50000000000006,475.00000000000006L155.90000000000006,477.20000000000005L153.00000000000006,478.1L149.70000000000005,478.5L146.50000000000006,479.5L144.80000000000007,481L144.20000000000007,482.4L144.00000000000009,483.79999999999995L143.10000000000008,485.4L142.20000000000007,486.2L140.40000000000006,487.2L139.30000000000007,488.2L137.70000000000007,491.2L136.50000000000009,492.3L134.8000000000001,491.6L134.3000000000001,489.90000000000003L134.3000000000001,487.90000000000003L134.00000000000009,486.1L132.50000000000009,485.40000000000003L130.50000000000009,483.90000000000003L129.60000000000008,480.6L129.80000000000007,477.1L131.00000000000006,475L130.00000000000006,472.7L129.30000000000007,470.09999999999997L128.70000000000007,464.7L128.90000000000006,461.9L129.50000000000006,460.2L130.50000000000006,459.09999999999997L134.20000000000005,456.2L136.10000000000005,455.4L138.20000000000005,455.29999999999995L142.90000000000003,455.9L145.20000000000005,456.59999999999997L146.70000000000005,457.9L146.50000000000006,460.2L148.80000000000007,458.09999999999997L150.60000000000008,455.59999999999997L152.9000000000001,454.29999999999995L156.50000000000009,455.59999999999997L156.50000000000009,451.9L157.70000000000007,450.29999999999995L159.80000000000007,449.19999999999993L162.00000000000006,447.49999999999994L160.00000000000006,448.19999999999993L157.80000000000007,448.69999999999993L155.80000000000007,448.29999999999995L154.20000000000007,446.49999999999994L161.50000000000009,441.8999999999999L164.20000000000007,439.49999999999994L168.40000000000006,434.29999999999995L170.70000000000007,432.29999999999995L175.90000000000006,430.79999999999995L178.40000000000006,427.59999999999997L180.30000000000007,426.79999999999995L181.70000000000007,427.49999999999994L183.00000000000009,428.69999999999993L184.3000000000001,429.3999999999999L185.9000000000001,428.5999999999999L186.9000000000001,427.7999999999999L189.60000000000008,426.4999999999999L200.00000000000009,426.7999999999999L200.9000000000001,426.9999999999999L202.7000000000001,428.1999999999999L207.4000000000001,431.1999999999999L209.60000000000008,433.09999999999985L210.70000000000007,434.49999999999983L211.80000000000007,436.29999999999984L212.50000000000006,439.89999999999986L212.60000000000005,442.09999999999985L212.40000000000006,443.89999999999986L211.90000000000006,445.1999999999999L210.20000000000007,447.59999999999985L209.60000000000008,448.89999999999986L209.70000000000007,450.29999999999984L213.00000000000009,454.59999999999985L215.00000000000009,456.39999999999986L216.10000000000008,458.09999999999985L217.9000000000001,469.49999999999983L217.8000000000001,472.09999999999985L217.3000000000001,473.39999999999986L216.50000000000009,474.59999999999985L214.70000000000007,477.09999999999985L212.30000000000007,479.09999999999985L211.40000000000006,480.1999999999999L210.80000000000007,482.4999999999999L210.70000000000007,484.89999999999986L210.90000000000006,486.29999999999984L211.50000000000006,487.79999999999984L213.10000000000005,489.39999999999986L218.20000000000005,493.6999999999999L220.80000000000004,495.2999999999999L222.00000000000003,496.1999999999999L223.00000000000003,497.4999999999999L223.70000000000002,499.6999999999999L224.4,505.1999999999999L225,507.59999999999985L225.9,509.1999999999999L227.20000000000002,510.89999999999986L232.50000000000003,515.6999999999998L234.70000000000002,518.5999999999998L235.60000000000002,521.7999999999998L236.10000000000002,522.9999999999999ZM342.1,357.6L336.1,359.20000000000005L327.40000000000003,360.70000000000005L319.50000000000006,361.90000000000003L315.80000000000007,362.70000000000005L312.4000000000001,365.40000000000003L304.80000000000007,371.6L301.1000000000001,373.6L296.9000000000001,374L290.5000000000001,381.3L286.8000000000001,386L282.5000000000001,389.4L277.4000000000001,392.59999999999997L265.30000000000007,392.2L257.4000000000001,391.8L254.00000000000009,393.40000000000003L251.00000000000009,396.50000000000006L247.70000000000007,397.70000000000005L233.90000000000006,395.30000000000007L233.00000000000006,394.6000000000001L233.00000000000006,393.7000000000001L231.60000000000005,393.6000000000001L223.30000000000004,394.30000000000007L213.50000000000003,396.50000000000006L208.30000000000004,396.90000000000003L206.70000000000005,397.70000000000005L204.80000000000004,399.30000000000007L200.40000000000003,404.6000000000001L192.30000000000004,416.80000000000007L190.60000000000005,422.4000000000001L188.30000000000004,425.6000000000001L180.60000000000005,425.30000000000007L176.20000000000005,423.6000000000001L176.50000000000006,420.00000000000006L174.00000000000006,421.30000000000007L173.00000000000006,423.70000000000005L173.50000000000006,426.30000000000007L175.30000000000007,428.00000000000006L173.30000000000007,429.1000000000001L171.60000000000008,429.00000000000006L170.00000000000009,428.40000000000003L168.10000000000008,428.00000000000006L166.80000000000007,428.50000000000006L166.20000000000007,429.80000000000007L165.90000000000006,431.30000000000007L165.40000000000006,432.6000000000001L161.20000000000007,440.1000000000001L159.70000000000007,441.80000000000007L158.10000000000008,442.50000000000006L154.60000000000008,443.40000000000003L152.60000000000008,444.70000000000005L151.20000000000007,446.50000000000006L149.20000000000007,450.40000000000003L147.60000000000008,452.1L143.9000000000001,453.3L140.50000000000009,452.6L137.00000000000009,451.40000000000003L133.10000000000008,451.00000000000006L136.9000000000001,444.1000000000001L137.00000000000009,442.9000000000001L139.70000000000007,442.1000000000001L144.20000000000007,437.1000000000001L142.10000000000008,437.80000000000007L140.00000000000009,441.00000000000006L138.20000000000007,441.80000000000007L134.60000000000008,441.9000000000001L133.20000000000007,442.2000000000001L132.00000000000009,442.9000000000001L133.9000000000001,445.2000000000001L133.7000000000001,446.7000000000001L131.0000000000001,449.9000000000001L130.5000000000001,451.2000000000001L130.1000000000001,453.6000000000001L129.2000000000001,455.00000000000006L126.0000000000001,458.70000000000005L125.3000000000001,460.20000000000005L124.6000000000001,464.80000000000007L125.3000000000001,480.70000000000005L124.3000000000001,480.70000000000005L123.40000000000009,448.6L122.6000000000001,443.8L119.90000000000009,435.7L118.50000000000009,432.9L119.70000000000009,431.5L124.30000000000008,430L125.10000000000008,429.2L125.20000000000007,428.3L123.80000000000007,426.1L123.80000000000007,424.70000000000005L124.30000000000007,423.90000000000003L128.40000000000006,420.3L129.10000000000005,419L129.20000000000005,418L128.60000000000005,417.4L127.40000000000005,416.29999999999995L126.90000000000005,415.59999999999997L129.20000000000005,405.99999999999994L137.30000000000004,382.3999999999999L138.70000000000005,381.7999999999999L144.00000000000006,381.3999999999999L145.70000000000005,380.8999999999999L147.00000000000006,379.69999999999993L148.50000000000006,377.79999999999995L149.80000000000007,376.69999999999993L152.30000000000007,375.79999999999995L153.70000000000007,374.9L156.40000000000006,372.09999999999997L160.60000000000005,366.49999999999994L161.50000000000006,365.09999999999997L162.60000000000005,361.59999999999997L163.80000000000004,356.59999999999997L165.80000000000004,353.4L167.90000000000003,352.7L175.10000000000002,352.09999999999997L188.90000000000003,352.79999999999995L190.40000000000003,353.19999999999993L193.30000000000004,355.5999999999999L194.70000000000005,356.3999999999999L197.00000000000006,356.5999999999999L205.50000000000006,354.7999999999999L207.20000000000005,354.6999999999999L212.60000000000005,355.2999999999999L218.00000000000006,357.0999999999999L219.50000000000006,357.7999999999999L221.60000000000005,359.2999999999999L223.40000000000006,361.0999999999999L224.90000000000006,361.7999999999999L227.30000000000007,362.4999999999999L245.00000000000006,365.6999999999999L247.20000000000005,365.59999999999985L260.80000000000007,364.1999999999999L266.30000000000007,362.7999999999999L270.30000000000007,360.8999999999999L271.00000000000006,360.49999999999994L279.80000000000007,351.69999999999993L280.6000000000001,350.19999999999993L281.00000000000006,348.19999999999993L281.80000000000007,333.99999999999994L282.50000000000006,332.29999999999995L283.90000000000003,331.09999999999997L286.00000000000006,329.99999999999994L286.6000000000001,329.49999999999994L294.7000000000001,335.3999999999999L298.1000000000001,334.99999999999994L302.6000000000001,333.49999999999994L305.6000000000001,333.8999999999999L309.4000000000001,337.7999999999999L314.6000000000001,340.0999999999999L336.1000000000001,348.69999999999993L339.80000000000007,351.79999999999995L342.1000000000001,357.59999999999997Z"
    let d5="M786.4,270.7L786.8,271.9L803.8,294.7L804.9,297.4L805.6999999999999,301.29999999999995L805.6999999999999,302.49999999999994L805.4,303.99999999999994L793,335.49999999999994L779.7,355.8999999999999L777.7,358.0999999999999L775.7,359.0999999999999L751.4000000000001,362.19999999999993L744.4000000000001,362.29999999999995L700.6000000000001,354.19999999999993L698.9000000000001,354.79999999999995L697.6000000000001,355.49999999999994L655.1000000000001,386.19999999999993L653.3000000000002,387.0999999999999L608.9000000000002,387.7999999999999L600.9000000000002,386.4999999999999L530.4000000000002,359.5999999999999L527.7000000000002,358.0999999999999L524.8000000000002,355.7999999999999L523.3000000000002,352.5999999999999L516.3000000000002,345.9999999999999L509.6000000000002,348.0999999999999L507.1000000000002,349.3999999999999L504.2000000000002,351.99999999999994L499.4000000000002,357.79999999999995L491.6000000000002,363.29999999999995L471.50000000000017,368.19999999999993L471.8000000000002,365.69999999999993L471.8000000000002,363.79999999999995L471.6000000000002,361.69999999999993L470.50000000000017,360.5999999999999L467.90000000000015,359.4999999999999L441.60000000000014,351.6999999999999L437.20000000000016,349.59999999999985L434.20000000000016,346.99999999999983L440.40000000000015,342.29999999999984L442.8000000000001,328.89999999999986L449.8000000000001,324.09999999999985L455.7000000000001,311.89999999999986L448.7000000000001,296.09999999999985L444.0000000000001,279.59999999999985L455.10000000000014,275.39999999999986L473.40000000000015,272.89999999999986L486.20000000000016,269.09999999999985L479.20000000000016,265.59999999999985L482.20000000000016,247.29999999999984L487.50000000000017,224.09999999999985L474.00000000000017,225.99999999999986L446.90000000000015,211.89999999999986L452.8000000000001,202.79999999999987L454.0000000000001,172.19999999999987L458.7000000000001,170.39999999999986L466.9000000000001,167.29999999999987L473.4000000000001,162.99999999999986L486.30000000000007,150.79999999999987L493.4000000000001,160.59999999999988L506.9000000000001,167.8999999999999L519.2,173.9999999999999L525.7,178.8999999999999L549.8000000000001,159.9999999999999L575.7,138.59999999999988L593.9000000000001,121.99999999999989L596.3000000000001,115.89999999999989L612.7,109.19999999999989L619.5,94.99999999999989L620.3,95.49999999999989L621.9,96.09999999999988L622.6999999999999,96.69999999999987L623.0999999999999,97.59999999999988L623.6999999999999,97.99999999999989L625.0999999999999,98.69999999999989L626.5999999999999,99.79999999999988L627.6999999999999,99.99999999999989L628.8,99.69999999999989L633.1999999999999,97.29999999999988L634.0999999999999,97.09999999999988L637.1999999999999,97.09999999999988L638.9999999999999,96.69999999999987L643.8999999999999,94.49999999999987L652.3999999999999,92.69999999999987L655.4999999999999,91.49999999999987L657.4999999999999,91.69999999999987L657.7999999999998,94.09999999999988L655.0999999999998,99.19999999999987L654.7999999999998,101.79999999999987L656.3999999999999,102.89999999999986L662.3999999999999,100.59999999999987L664.7999999999998,100.69999999999986L665.5999999999998,101.59999999999987L666.8999999999997,103.89999999999986L667.6999999999997,104.79999999999987L672.1999999999997,107.89999999999986L673.0999999999997,109.09999999999987L673.4999999999997,110.39999999999986L673.6999999999997,113.29999999999987L673.8999999999997,114.59999999999987L676.1999999999997,120.29999999999987L677.1999999999997,122.09999999999987L678.3999999999997,123.69999999999986L679.8999999999997,125.19999999999986L683.9999999999998,128.29999999999987L684.8999999999997,129.59999999999988L685.2999999999997,130.9999999999999L685.1999999999997,132.3999999999999L684.4999999999997,135.2999999999999L684.4999999999997,136.6999999999999L684.8999999999996,137.7999999999999L685.5999999999997,138.7999999999999L688.4999999999997,142.2999999999999L689.9999999999997,144.8999999999999L690.6999999999997,147.6999999999999L690.7999999999997,150.99999999999991L689.4999999999998,155.29999999999993L689.6999999999998,156.69999999999993L690.5999999999998,157.89999999999992L691.6999999999998,158.79999999999993L694.1999999999998,160.19999999999993L695.4999999999998,161.29999999999993L696.5999999999998,162.39999999999992L698.3999999999997,165.19999999999993L699.0999999999998,166.59999999999994L699.2999999999998,167.79999999999993L698.9999999999999,168.99999999999991L696.5999999999999,172.89999999999992L695.9999999999999,174.29999999999993L695.7999999999998,175.69999999999993L695.9999999999999,177.19999999999993L697.5999999999999,181.39999999999992L699.9999999999999,181.29999999999993L704.8999999999999,180.39999999999992L707.1999999999998,180.5999999999999L708.3999999999999,180.99999999999991L711.3999999999999,183.1999999999999L712.5999999999999,183.6999999999999L716.3,184.6999999999999L718.3,185.8999999999999L720.0999999999999,187.4999999999999L721.1999999999999,189.4999999999999L721.5999999999999,191.8999999999999L720.6999999999999,198.1999999999999L720.6999999999999,199.6999999999999L720.9999999999999,201.0999999999999L721.5999999999999,202.5999999999999L722.4999999999999,203.39999999999992L727.4999999999999,204.5999999999999L729.7999999999998,204.2999999999999L732.2999999999998,202.7999999999999L734.3999999999999,201.0999999999999L736.7999999999998,199.6999999999999L739.2999999999998,199.3999999999999L741.8999999999999,200.59999999999988L742.8999999999999,201.79999999999987L743.3999999999999,203.29999999999987L744.0999999999999,207.99999999999986L744.5999999999999,209.09999999999985L746.1999999999999,211.29999999999984L746.9999999999999,212.49999999999983L747.2999999999998,213.79999999999984L747.2999999999998,219.49999999999983L747.8999999999999,222.19999999999982L749.1999999999998,224.7999999999998L751.1999999999998,226.8999999999998L760.8999999999999,233.5999999999998L762.8999999999999,235.6999999999998L763.9999999999999,238.4999999999998L763.0999999999999,240.7999999999998L760.3999999999999,241.2999999999998L754.8999999999999,240.69999999999982L753.1999999999998,241.8999999999998L754.1999999999998,243.9999999999998L757.8999999999999,247.7999999999998L759.2999999999998,248.8999999999998L760.7999999999998,249.3999999999998L762.2999999999998,249.3999999999998L765.7999999999998,248.69999999999982L767.4999999999999,248.69999999999982L769.0999999999999,249.19999999999982L770.5999999999999,250.19999999999982L771.3999999999999,251.3999999999998L771.7999999999998,252.69999999999982L771.8999999999999,253.99999999999983L770.9999999999999,258.29999999999984L771.0999999999999,259.59999999999985L771.8,261.59999999999985L775.9,262.89999999999986L782,268.79999999999984L786.4,270.6999999999998Z"
    let d6="M486.3,150.8L473.40000000000003,163L466.90000000000003,167.3L458.70000000000005,170.4L454.00000000000006,172.20000000000002L452.80000000000007,202.8L446.9000000000001,211.9L474.0000000000001,226L487.5000000000001,224.1L482.2000000000001,247.29999999999998L479.2000000000001,265.59999999999997L486.2000000000001,269.09999999999997L473.4000000000001,272.9L455.1000000000001,275.4L444.00000000000006,279.59999999999997L448.70000000000005,296.09999999999997L455.70000000000005,311.9L449.80000000000007,324.09999999999997L442.80000000000007,328.9L440.4000000000001,342.29999999999995L434.2000000000001,346.99999999999994L430.5000000000001,341.99999999999994L428.5000000000001,340.3999999999999L425.8000000000001,340.99999999999994L423.10000000000014,342.29999999999995L408.70000000000016,351.19999999999993L405.60000000000014,352.3999999999999L401.8000000000001,353.2999999999999L396.3000000000001,352.7999999999999L371.60000000000014,347.7999999999999L363.40000000000015,344.6999999999999L350.50000000000017,336.7999999999999L344.6000000000002,333.2999999999999L340.4000000000002,328.5999999999999L339.4000000000002,324.9999999999999L338.6000000000002,314.89999999999986L337.50000000000017,313.39999999999986L336.1000000000002,313.09999999999985L334.00000000000017,312.89999999999986L323.3000000000002,313.89999999999986L321.8000000000002,313.6999999999999L319.4000000000002,312.7999999999999L315.8000000000002,310.4999999999999L311.3000000000002,310.0999999999999L302.70000000000016,310.3999999999999L298.60000000000014,311.69999999999993L295.70000000000016,309.3999999999999L294.90000000000015,307.19999999999993L294.8000000000001,304.99999999999994L294.60000000000014,304.09999999999997L293.70000000000016,302.7L290.90000000000015,300.8L286.90000000000015,299L286.20000000000016,298.5L285.10000000000014,297.3L284.20000000000016,294.7L283.10000000000014,293.7L281.3000000000001,292.9L280.2000000000001,291.7L279.7000000000001,289.8L279.6000000000001,287.6L279.6000000000001,286.1L277.2000000000001,285.6L237.4000000000001,285.90000000000003L233.7000000000001,286.8L228.5000000000001,291.40000000000003L224.90000000000012,289.50000000000006L221.30000000000013,288.1000000000001L219.60000000000014,287.00000000000006L218.80000000000013,286.20000000000005L217.70000000000013,284.50000000000006L216.80000000000013,282.1000000000001L216.30000000000013,279.00000000000006L215.60000000000014,277.30000000000007L214.70000000000013,275.9000000000001L210.00000000000014,270.1000000000001L209.10000000000014,268.7000000000001L207.50000000000014,264.6000000000001L207.00000000000014,261.50000000000006L207.30000000000015,259.30000000000007L207.60000000000016,255.10000000000008L207.20000000000016,252.80000000000007L206.50000000000017,251.10000000000008L205.40000000000018,249.30000000000007L204.00000000000017,246.10000000000008L202.90000000000018,245.10000000000008L202.00000000000017,245.50000000000009L199.90000000000018,246.9000000000001L199.10000000000016,247.00000000000009L198.40000000000018,246.60000000000008L197.80000000000018,245.60000000000008L197.30000000000018,243.50000000000009L196.40000000000018,235.4000000000001L195.80000000000018,233.9000000000001L194.2000000000002,232.8000000000001L191.80000000000018,232.7000000000001L189.30000000000018,233.4000000000001L187.40000000000018,233.50000000000009L179.7000000000002,231.60000000000008L178.5000000000002,231.60000000000008L176.8000000000002,232.30000000000007L175.70000000000022,233.50000000000006L174.3000000000002,235.60000000000005L172.70000000000022,237.40000000000006L170.9000000000002,240.20000000000007L169.8000000000002,241.30000000000007L167.3000000000002,244.70000000000007L166.3000000000002,247.20000000000007L165.9000000000002,249.00000000000009L165.3000000000002,250.70000000000007L164.4000000000002,252.10000000000008L157.1000000000002,259.80000000000007L156.2000000000002,261.20000000000005L154.1000000000002,263.70000000000005L152.80000000000018,264.70000000000005L151.2000000000002,264.70000000000005L150.40000000000018,264.20000000000005L149.7000000000002,263.30000000000007L148.90000000000018,261.9000000000001L148.7000000000002,259.1000000000001L149.5000000000002,257.2000000000001L149.9000000000002,255.8000000000001L149.20000000000022,254.00000000000009L148.10000000000022,252.70000000000007L147.20000000000022,252.10000000000008L144.60000000000022,250.80000000000007L143.20000000000022,249.90000000000006L142.00000000000023,248.80000000000007L140.00000000000023,246.10000000000008L139.00000000000023,244.00000000000009L138.00000000000023,242.60000000000008L137.00000000000023,241.9000000000001L135.10000000000022,241.10000000000008L133.8000000000002,240.70000000000007L132.8000000000002,238.90000000000006L132.4000000000002,235.70000000000007L133.20000000000022,228.60000000000008L134.4000000000002,224.60000000000008L137.3000000000002,218.80000000000007L138.0000000000002,215.60000000000008L138.0000000000002,213.50000000000009L137.2000000000002,211.60000000000008L136.40000000000018,210.4000000000001L131.50000000000017,206.4000000000001L130.80000000000018,206.00000000000009L141.40000000000018,191.70000000000007L162.60000000000016,155.9000000000001L163.30000000000015,154.2000000000001L163.10000000000016,152.5000000000001L162.30000000000015,150.7000000000001L188.70000000000016,150.1000000000001L191.80000000000015,149.5000000000001L194.90000000000015,148.5000000000001L198.40000000000015,145.90000000000012L200.60000000000014,145.0000000000001L203.40000000000015,144.6000000000001L205.90000000000015,144.5000000000001L208.20000000000016,144.1000000000001L209.40000000000015,142.8000000000001L210.10000000000014,141.6000000000001L212.20000000000013,136.0000000000001L213.20000000000013,134.0000000000001L214.90000000000012,132.6000000000001L221.80000000000013,129.0000000000001L222.70000000000013,128.30000000000013L223.10000000000014,127.50000000000013L223.60000000000014,125.70000000000013L224.40000000000015,124.30000000000013L225.50000000000014,123.00000000000013L231.10000000000014,118.30000000000013L232.00000000000014,117.80000000000013L262.60000000000014,100.40000000000012L263.60000000000014,99.70000000000012L264.70000000000016,98.30000000000011L266.40000000000015,95.4000000000001L267.10000000000014,93.7000000000001L268.3000000000001,92.60000000000011L271.40000000000015,91.00000000000011L274.10000000000014,89.00000000000011L275.70000000000016,87.20000000000012L277.70000000000016,88.50000000000011L281.10000000000014,91.60000000000011L314.40000000000015,130.0000000000001L316.20000000000016,131.2000000000001L341.70000000000016,129.4000000000001L342.8000000000002,118.1000000000001L435.6000000000002,118.3000000000001L438.3000000000002,119.3000000000001L451.3000000000002,126.3000000000001L459.8000000000002,125.7000000000001L478.1000000000002,138.6000000000001L486.3000000000002,150.8000000000001Z"
    let d7="M228.5,291.4L227.8,293.5L226.5,294.5L218.7,298.6L216.79999999999998,299.1L214.7,299.20000000000005L213.29999999999998,299.00000000000006L211.39999999999998,298.30000000000007L210.7,297.80000000000007L209.89999999999998,296.30000000000007L209.7,294.4000000000001L208.79999999999998,292.7000000000001L207.79999999999998,292.2000000000001L205.1,291.1000000000001L204.4,290.7000000000001L198.9,286.3000000000001L197.5,286.0000000000001L195,286.9000000000001L192.6,287.2000000000001L190,287.0000000000001L188.6,286.5000000000001L186.7,285.3000000000001L185.2,284.3000000000001L146.1,295.5000000000001L143.1,297.2000000000001L141.6,299.6000000000001L140.6,302.2000000000001L139.9,306.0000000000001L140,306.8000000000001L141.3,308.10000000000014L141.9,308.5000000000001L144.20000000000002,309.3000000000001L145.3,310.40000000000015L145.8,312.3000000000001L145.70000000000002,316.5000000000001L145.20000000000002,319.2000000000001L145.50000000000003,321.2000000000001L146.10000000000002,323.0000000000001L146.70000000000002,323.5000000000001L148.3,324.2000000000001L149.60000000000002,325.2000000000001L150.50000000000003,326.4000000000001L150.50000000000003,327.9000000000001L150.00000000000003,329.80000000000007L149.70000000000002,332.6000000000001L150.00000000000003,333.30000000000007L151.20000000000002,334.4000000000001L152.70000000000002,335.1000000000001L153.9,336.2000000000001L154.3,337.0000000000001L154.70000000000002,339.0000000000001L154.3,340.4000000000001L153.4,342.0000000000001L151.1,344.60000000000014L149.2,347.3000000000001L149.39999999999998,349.2000000000001L150.29999999999998,350.6000000000001L152.29999999999998,351.80000000000007L160.39999999999998,355.50000000000006L163.79999999999998,356.6000000000001L162.6,361.6000000000001L161.5,365.1000000000001L160.6,366.50000000000006L156.4,372.1000000000001L153.70000000000002,374.9000000000001L152.3,375.80000000000007L149.8,376.70000000000005L148.5,377.80000000000007L147,379.70000000000005L145.7,380.90000000000003L144,381.40000000000003L138.7,381.8L137.29999999999998,382.40000000000003L129.2,406.00000000000006L126.89999999999999,415.6000000000001L127.39999999999999,416.30000000000007L128.6,417.4000000000001L129.2,418.0000000000001L129.1,419.0000000000001L128.4,420.3000000000001L124.30000000000001,423.90000000000015L123.80000000000001,424.70000000000016L123.80000000000001,426.10000000000014L125.20000000000002,428.3000000000001L125.10000000000002,429.2000000000001L124.30000000000003,430.0000000000001L119.70000000000003,431.5000000000001L118.50000000000003,432.9000000000001L116.90000000000003,429.80000000000007L115.50000000000003,428.00000000000006L113.40000000000003,427.00000000000006L109.10000000000004,426.00000000000006L107.50000000000004,424.6000000000001L106.70000000000005,422.1000000000001L105.30000000000004,413.1000000000001L104.30000000000004,410.30000000000007L102.90000000000003,408.20000000000005L99.90000000000003,405.00000000000006L98.50000000000003,404.20000000000005L97.40000000000003,404.00000000000006L96.70000000000003,403.30000000000007L96.50000000000003,401.1000000000001L96.70000000000003,399.4000000000001L97.50000000000003,396.1000000000001L97.70000000000003,394.2000000000001L96.90000000000003,391.4000000000001L94.90000000000003,388.5000000000001L89.80000000000004,383.3000000000001L78.20000000000005,377.8000000000001L76.50000000000004,375.90000000000015L75.50000000000004,373.70000000000016L69.80000000000004,365.00000000000017L65.50000000000004,353.50000000000017L63.80000000000004,351.1000000000002L66.90000000000003,328.1000000000002L66.70000000000003,326.50000000000017L66.20000000000003,325.00000000000017L63.60000000000003,320.70000000000016L63.10000000000003,319.20000000000016L63.00000000000003,315.20000000000016L62.90000000000003,314.3000000000002L61.90000000000003,311.3000000000002L58.60000000000003,303.70000000000016L58.40000000000003,303.50000000000017L59.800000000000026,302.90000000000015L65.40000000000002,298.3000000000001L91.20000000000002,267.40000000000015L96.30000000000001,259.70000000000016L107.60000000000001,247.00000000000017L130.10000000000002,206.80000000000018L130.8,206.00000000000017L131.5,206.40000000000018L136.4,210.40000000000018L137.20000000000002,211.60000000000016L138.00000000000003,213.50000000000017L138.00000000000003,215.60000000000016L137.30000000000004,218.80000000000015L134.40000000000003,224.60000000000016L133.20000000000005,228.60000000000016L132.40000000000003,235.70000000000016L132.80000000000004,238.90000000000015L133.80000000000004,240.70000000000016L135.10000000000005,241.10000000000016L137.00000000000006,241.90000000000018L138.00000000000006,242.60000000000016L139.00000000000006,244.00000000000017L140.00000000000006,246.10000000000016L142.00000000000006,248.80000000000015L143.20000000000005,249.90000000000015L144.60000000000005,250.80000000000015L147.20000000000005,252.10000000000016L148.10000000000005,252.70000000000016L149.20000000000005,254.00000000000017L149.90000000000003,255.80000000000018L149.50000000000003,257.20000000000016L148.70000000000002,259.10000000000014L148.9,261.90000000000015L149.70000000000002,263.3000000000001L150.4,264.2000000000001L151.20000000000002,264.7000000000001L152.8,264.7000000000001L154.10000000000002,263.7000000000001L156.20000000000002,261.2000000000001L157.10000000000002,259.8000000000001L164.40000000000003,252.10000000000014L165.30000000000004,250.70000000000013L165.90000000000003,249.00000000000014L166.30000000000004,247.20000000000013L167.30000000000004,244.70000000000013L169.80000000000004,241.30000000000013L170.90000000000003,240.20000000000013L172.70000000000005,237.40000000000012L174.30000000000004,235.6000000000001L175.70000000000005,233.5000000000001L176.80000000000004,232.30000000000013L178.50000000000003,231.60000000000014L179.70000000000002,231.60000000000014L187.4,233.50000000000014L189.3,233.40000000000015L191.8,232.70000000000016L194.20000000000002,232.80000000000015L195.8,233.90000000000015L196.4,235.40000000000015L197.3,243.50000000000014L197.8,245.60000000000014L198.4,246.60000000000014L199.1,247.00000000000014L199.9,246.90000000000015L202,245.50000000000014L202.9,245.10000000000014L204,246.10000000000014L205.4,249.30000000000013L206.5,251.10000000000014L207.2,252.80000000000013L207.6,255.10000000000014L207.29999999999998,259.3000000000001L206.99999999999997,261.5000000000001L207.49999999999997,264.60000000000014L209.09999999999997,268.70000000000016L209.99999999999997,270.10000000000014L214.69999999999996,275.90000000000015L215.59999999999997,277.3000000000001L216.29999999999995,279.0000000000001L216.79999999999995,282.10000000000014L217.69999999999996,284.5000000000001L218.79999999999995,286.2000000000001L219.59999999999997,287.0000000000001L221.29999999999995,288.10000000000014L224.89999999999995,289.5000000000001L228.49999999999994,291.4000000000001Z"
    let d8="M619.5,95L612.7,109.2L596.3000000000001,115.9L593.9000000000001,122L575.7,138.6L549.8000000000001,160L525.7,178.9L519.2,174L506.90000000000003,167.9L493.40000000000003,160.6L486.3,150.79999999999998L478.1,138.6L459.8,125.69999999999999L451.3,126.29999999999998L438.3,119.29999999999998L435.6,118.29999999999998L342.8,118.09999999999998L341.7,129.39999999999998L316.2,131.2L314.4,130L281.09999999999997,91.6L277.7,88.5L275.7,87.2L274.09999999999997,89L271.4,91L268.29999999999995,92.6L267.09999999999997,93.69999999999999L266.4,95.39999999999999L264.7,98.3L263.59999999999997,99.7L262.59999999999997,100.4L231.99999999999997,117.80000000000001L231.09999999999997,118.30000000000001L225.49999999999997,123.00000000000001L224.39999999999998,124.30000000000001L223.59999999999997,125.70000000000002L223.09999999999997,127.50000000000001L222.69999999999996,128.3L221.79999999999995,129L214.89999999999995,132.6L213.19999999999996,134L212.19999999999996,136L210.09999999999997,141.6L209.39999999999998,142.79999999999998L208.2,144.1L205.89999999999998,144.5L203.39999999999998,144.6L200.59999999999997,145L198.39999999999998,145.9L194.89999999999998,148.5L191.79999999999998,149.5L188.7,150.1L162.29999999999998,150.7L161.99999999999997,150.1L165.69999999999996,143.79999999999998L167.29999999999995,134.49999999999997L167.69999999999996,116.09999999999997L168.59999999999997,114.19999999999996L170.89999999999998,106.69999999999996L173.7,99.89999999999996L174.39999999999998,88.49999999999996L175.59999999999997,85.09999999999995L177.89999999999998,82.99999999999996L183.89999999999998,81.59999999999995L186.49999999999997,79.89999999999995L187.49999999999997,78.19999999999995L188.19999999999996,76.19999999999995L194.79999999999995,47.599999999999945L195.59999999999997,40.89999999999994L196.89999999999998,37.69999999999994L199.09999999999997,34.499999999999936L202.09999999999997,31.599999999999937L205.59999999999997,29.499999999999936L209.19999999999996,28.699999999999935L214.59999999999997,29.799999999999937L216.39999999999998,29.899999999999938L218.29999999999998,29.599999999999937L219.89999999999998,28.799999999999937L224.7,25.399999999999938L226.5,24.49999999999994L228.5,24.09999999999994L230.5,24.49999999999994L232,25.49999999999994L233.2,26.69999999999994L235.2,29.599999999999937L237.89999999999998,32.59999999999994L241.2,34.19999999999994L244.89999999999998,34.59999999999994L248.7,33.999999999999936L251,32.59999999999994L252.3,32.399999999999935L253.60000000000002,32.69999999999993L255.70000000000002,33.59999999999993L256.70000000000005,33.69999999999993L257.90000000000003,33.399999999999935L264.3,30.499999999999936L266.6,30.299999999999937L272.3,31.699999999999935L273.7,31.699999999999935L277.7,30.899999999999935L280.2,31.099999999999934L287.59999999999997,33.499999999999936L292.79999999999995,33.79999999999993L294.19999999999993,34.19999999999993L297.99999999999994,35.99999999999993L300.59999999999997,36.69999999999993L303.09999999999997,36.49999999999993L305.4,35.69999999999993L307.7,34.29999999999993L311.3,30.999999999999932L313.2,29.799999999999933L315.7,29.399999999999935L322.59999999999997,30.799999999999933L324.99999999999994,30.599999999999934L326.8999999999999,29.599999999999934L328.49999999999994,28.199999999999935L332.3999999999999,22.499999999999936L334.3999999999999,20.699999999999935L336.7999999999999,19.599999999999934L339.1999999999999,19.799999999999933L340.7999999999999,21.099999999999934L341.6999999999999,22.799999999999933L342.7999999999999,24.399999999999935L344.7999999999999,25.299999999999933L347.1999999999999,25.199999999999932L349.4999999999999,24.59999999999993L356.2999999999999,21.79999999999993L358.7999999999999,21.19999999999993L363.9999999999999,20.99999999999993L371.6999999999999,22.29999999999993L374.2999999999999,22.19999999999993L391.6999999999999,19.399999999999928L395.09999999999985,18.099999999999927L396.1999999999999,17.399999999999928L396.89999999999986,16.399999999999928L396.89999999999986,15.199999999999928L396.39999999999986,14.099999999999929L393.79999999999984,11.499999999999929L392.79999999999984,9.29999999999993L393.09999999999985,7.0999999999999295L394.59999999999985,5.399999999999929L396.89999999999986,4.79999999999993L399.1999999999999,5.49999999999993L400.6999999999999,7.09999999999993L401.89999999999986,9.09999999999993L403.59999999999985,10.69999999999993L404.79999999999984,11.09999999999993L405.99999999999983,10.99999999999993L407.09999999999985,10.49999999999993L408.1999999999999,9.69999999999993L408.89999999999986,8.69999999999993L409.29999999999984,7.59999999999993L409.79999999999984,5.19999999999993L410.89999999999986,3.59999999999993L412.4999999999999,2.49999999999993L416.1999999999999,0.9999999999999298L417.9999999999999,1.8999999999999297L420.0999999999999,4.19999999999993L421.4999999999999,6.99999999999993L423.1999999999999,9.09999999999993L426.1999999999999,9.59999999999993L431.09999999999985,8.399999999999931L458.79999999999984,10.399999999999931L460.6999999999998,10.199999999999932L466.0999999999998,8.699999999999932L467.6999999999998,8.699999999999932L469.1999999999998,9.099999999999932L473.6999999999998,11.299999999999933L475.49999999999983,11.599999999999934L477.29999999999984,11.499999999999934L484.09999999999985,9.599999999999934L485.79999999999984,9.599999999999934L492.39999999999986,10.899999999999935L494.09999999999985,10.999999999999934L495.89999999999986,10.799999999999935L497.59999999999985,10.299999999999935L499.1999999999999,9.599999999999936L503.39999999999986,6.999999999999936L504.9999999999999,6.399999999999936L508.0999999999999,6.199999999999936L518.3999999999999,10.299999999999937L519.6999999999998,11.099999999999937L520.2999999999998,12.399999999999938L520.2999999999998,14.199999999999939L519.3999999999999,17.49999999999994L519.6999999999998,18.79999999999994L521.1999999999998,19.49999999999994L527.3999999999999,18.899999999999938L528.9999999999999,19.599999999999937L529.4999999999999,20.999999999999936L529.7999999999998,23.999999999999936L530.5999999999998,25.299999999999937L532.2999999999998,26.099999999999937L536.1999999999998,26.399999999999938L537.9999999999998,26.69999999999994L539.2999999999997,27.49999999999994L542.0999999999997,31.09999999999994L543.1999999999997,32.19999999999994L547.0999999999997,34.89999999999994L552.5999999999997,41.39999999999994L562.1999999999997,50.199999999999946L567.5999999999997,53.29999999999995L568.6999999999997,54.39999999999995L571.4999999999997,57.79999999999995L572.9999999999997,58.699999999999946L576.0999999999997,59.99999999999994L577.5999999999997,60.79999999999994L578.5999999999997,61.89999999999994L578.6999999999997,63.099999999999945L577.6999999999997,65.69999999999995L577.3999999999997,67.19999999999995L577.6999999999997,68.29999999999994L579.2999999999997,70.39999999999993L579.9999999999998,71.89999999999993L580.0999999999998,73.29999999999994L579.2999999999998,76.29999999999994L579.8999999999999,78.99999999999994L582.5999999999999,80.49999999999994L588.9999999999999,82.39999999999995L590.2999999999998,83.19999999999995L592.8999999999999,85.19999999999995L593.8999999999999,86.29999999999994L594.6999999999998,87.69999999999995L596.0999999999998,92.19999999999995L596.8999999999997,93.89999999999995L597.8999999999997,95.29999999999995L599.1999999999997,96.59999999999995L600.6999999999997,97.49999999999996L601.9999999999997,97.89999999999996L603.2999999999996,97.69999999999996L604.5999999999996,97.29999999999995L607.2999999999996,95.69999999999996L609.8999999999996,93.69999999999996L610.9999999999997,92.49999999999996L613.8999999999996,88.29999999999995L615.0999999999997,87.09999999999995L616.4999999999997,86.29999999999995L617.8999999999996,85.89999999999995L619.3999999999996,85.79999999999995L620.8999999999996,85.99999999999996L620.5999999999997,88.09999999999995L618.9999999999997,93.19999999999995L619.4999999999997,94.99999999999994Z"
    let d9="M434.2,347L437.2,349.6L441.59999999999997,351.70000000000005L467.9,359.50000000000006L470.5,360.6000000000001L471.6,361.7000000000001L471.8,363.8000000000001L471.8,365.7000000000001L471.5,368.2000000000001L471.3,399.8000000000001L475,410.7000000000001L477.1,413.7000000000001L477.90000000000003,416.7000000000001L478.70000000000005,429.4000000000001L480.1,436.80000000000007L480.5,440.1000000000001L480.5,442.9000000000001L479,449.80000000000007L477.7,452.00000000000006L474.7,453.30000000000007L473.8,454.00000000000006L473.2,456.90000000000003L473.3,459.90000000000003L472.6,463.1L472.20000000000005,463.90000000000003L462.6,473.1L458.8,476.20000000000005L458.1,476.6L450.6,478.5L449,479.2L446,479.5L444,479.8L442.4,480.5L440.09999999999997,482.9L438.2,485.59999999999997L435.3,490.7L434.6,492.9L431.6,490.4L425.6,488.4L409.3,487.7L399.6,484L396.20000000000005,483.8L384.30000000000007,488.2L372.1000000000001,496.09999999999997L368.7000000000001,496.9L367.3000000000001,495.79999999999995L364.2000000000001,491.59999999999997L362.6000000000001,490.2L355.6000000000001,489.09999999999997L348.1000000000001,491.9L339.9000000000001,488.09999999999997L335.2000000000001,488.09999999999997L328.7000000000001,487.4L317.5000000000001,482.59999999999997L314.0000000000001,488.09999999999997L311.10000000000014,492.9L308.10000000000014,494.09999999999997L304.0000000000001,492.29999999999995L299.3000000000001,487.4L297.0000000000001,482.59999999999997L297.0000000000001,478.4L298.7000000000001,474.09999999999997L298.1000000000001,469.9L291.1000000000001,465.59999999999997L285.2000000000001,459.59999999999997L283.4000000000001,455.9L282.9000000000001,451.7L280.5000000000001,448.59999999999997L273.4000000000001,447.4L273.4000000000001,428L275.2000000000001,421.9L279.3000000000001,412.79999999999995L282.3000000000001,405.49999999999994L282.5000000000001,389.3999999999999L286.8000000000001,385.99999999999994L290.5000000000001,381.29999999999995L296.9000000000001,373.99999999999994L301.1000000000001,373.59999999999997L304.80000000000007,371.59999999999997L312.4000000000001,365.4L315.80000000000007,362.7L319.50000000000006,361.9L327.40000000000003,360.7L336.1,359.2L342.1,357.59999999999997L347,352.2L350.5,336.8L363.4,344.7L371.59999999999997,347.8L396.29999999999995,352.8L401.79999999999995,353.3L405.59999999999997,352.40000000000003L408.7,351.20000000000005L423.09999999999997,342.30000000000007L425.79999999999995,341.00000000000006L428.49999999999994,340.40000000000003L430.49999999999994,342.00000000000006L434.19999999999993,347.00000000000006Z"
    let d10="M63.8,351.1L59,344.40000000000003L54.3,340.1L51.599999999999994,338.20000000000005L48.39999999999999,336.70000000000005L44.89999999999999,336.1L42.19999999999999,335.3L35.39999999999999,331.7L34.29999999999999,330.5L28.89999999999999,330.5L24.29999999999999,329.9L20.19999999999999,330.2L16.599999999999987,332.8L17.999999999999986,334.5L19.899999999999984,335L18.699999999999985,337.5L16.599999999999984,338.5L18.699999999999985,340.8L17.699999999999985,343.2L17.099999999999984,343.3L16.599999999999984,344.3L14.499999999999984,342.90000000000003L3.5999999999999837,329.3L0.9999999999999836,326.90000000000003L27.799999999999983,319.70000000000005L35.69999999999998,313.20000000000005L58.39999999999998,303.50000000000006L58.59999999999998,303.70000000000005L61.89999999999998,311.30000000000007L62.89999999999998,314.30000000000007L62.99999999999998,315.20000000000005L63.09999999999998,319.20000000000005L63.59999999999998,320.70000000000005L66.19999999999997,325.00000000000006L66.69999999999997,326.50000000000006L66.89999999999998,328.1000000000001L63.799999999999976,351.1000000000001Z"
    let d11="M356.5,560.2L356.1,567.5L354.6,573.8L352.70000000000005,580.1999999999999L353.70000000000005,585.9999999999999L359.40000000000003,589.9999999999999L367.00000000000006,591.3999999999999L369.40000000000003,595.2999999999998L372.70000000000005,604.0999999999998L373.20000000000005,609.4999999999998L373.70000000000005,613.3999999999997L378.90000000000003,616.7999999999997L384.6,620.6999999999997L384.1,625.0999999999997L384.6,630.9999999999997L387.90000000000003,634.8999999999996L390.8,639.7999999999996L390.8,653.4999999999997L388.40000000000003,658.7999999999996L387.00000000000006,663.6999999999996L388.30000000000007,673.8999999999996L380.4000000000001,673.8999999999996L375.7000000000001,674.5999999999997L371.5000000000001,676.4999999999997L362.10000000000014,683.2999999999996L352.20000000000016,687.8999999999996L343.20000000000016,694.5999999999997L302.3000000000002,713.7999999999997L296.70000000000016,714.9999999999998L268.70000000000016,713.2999999999997L268.00000000000017,712.2999999999997L263.00000000000017,704.8999999999997L261.40000000000015,701.2999999999997L258.40000000000015,696.9999999999998L256.10000000000014,692.0999999999998L255.70000000000013,687.6999999999998L255.80000000000013,686.6999999999998L258.40000000000015,688.7999999999998L259.70000000000016,690.2999999999998L261.60000000000014,690.6999999999998L272.0000000000001,690.7999999999998L273.0000000000001,691.5999999999998L275.10000000000014,693.7999999999998L275.90000000000015,694.1999999999998L277.3000000000001,693.9999999999998L281.40000000000015,692.9999999999998L283.3000000000001,691.7999999999997L285.10000000000014,689.5999999999997L287.40000000000015,688.2999999999997L290.8000000000001,689.7999999999997L291.7000000000001,688.9999999999998L292.7000000000001,688.4999999999998L293.7000000000001,688.4999999999998L296.0000000000001,690.0999999999998L297.7000000000001,689.5999999999998L298.6000000000001,689.7999999999998L299.9000000000001,691.2999999999998L301.0000000000001,694.0999999999998L301.9000000000001,695.3999999999997L302.9000000000001,696.2999999999997L304.1000000000001,696.9999999999998L305.50000000000006,697.4999999999998L307.50000000000006,697.4999999999998L309.30000000000007,697.0999999999998L316.70000000000005,694.0999999999998L319.70000000000005,690.9999999999998L324.70000000000005,684.4999999999998L326.50000000000006,683.1999999999998L328.20000000000005,682.2999999999998L329.40000000000003,681.0999999999998L329.8,678.8999999999997L328.90000000000003,677.7999999999997L327.1,677.0999999999997L326.1,676.1999999999997L327.5,674.7999999999997L325.9,671.0999999999997L324.4,665.9999999999997L323.9,660.7999999999996L325.29999999999995,656.6999999999996L327.19999999999993,655.4999999999995L329.49999999999994,655.3999999999995L331.8999999999999,655.6999999999995L334.0999999999999,655.3999999999995L336.3999999999999,654.3999999999995L337.8999999999999,653.1999999999995L338.99999999999994,651.6999999999995L339.69999999999993,649.6999999999995L342.99999999999994,652.9999999999994L346.09999999999997,653.8999999999994L348.09999999999997,652.0999999999995L348.49999999999994,647.4999999999994L345.99999999999994,650.0999999999995L343.59999999999997,649.9999999999994L341.2,648.9999999999994L338.59999999999997,648.5999999999995L336.09999999999997,649.6999999999995L332.09999999999997,652.6999999999995L329.2,653.2999999999995L327.59999999999997,653.2999999999995L325.09999999999997,653.5999999999995L322.9,654.7999999999995L322,657.1999999999995L322,666.8999999999995L323.8,673.0999999999996L324.1,674.7999999999996L324.20000000000005,677.4999999999997L324.1,678.8999999999996L323.6,679.9999999999997L319.70000000000005,683.3999999999996L318.40000000000003,684.9999999999997L310.3,692.4999999999997L308.1,693.7999999999996L306.20000000000005,693.8999999999996L304.50000000000006,693.1999999999996L303.1000000000001,691.9999999999995L304.00000000000006,686.9999999999995L299.1000000000001,684.6999999999996L287.6000000000001,682.8999999999996L279.80000000000007,687.8999999999996L276.9000000000001,688.5999999999997L275.6000000000001,686.8999999999996L274.50000000000006,685.6999999999996L272.50000000000006,685.0999999999996L270.6000000000001,685.4999999999995L267.80000000000007,687.0999999999996L265.9000000000001,687.3999999999995L264.0000000000001,686.8999999999995L261.5000000000001,685.5999999999996L257.5000000000001,682.8999999999995L257.3000000000001,682.0999999999996L257.60000000000014,679.7999999999996L257.0000000000001,679.3999999999996L254.80000000000013,679.0999999999997L253.0000000000001,678.2999999999997L252.0000000000001,676.9999999999998L249.80000000000013,672.5999999999998L247.80000000000013,671.0999999999998L247.20000000000013,667.5999999999998L246.30000000000013,665.6999999999998L246.10000000000014,664.1999999999998L246.40000000000015,661.8999999999999L247.10000000000014,660.3999999999999L248.50000000000014,650.0999999999999L248.80000000000015,649.0999999999999L249.70000000000016,647.9999999999999L251.40000000000015,646.3999999999999L252.10000000000014,644.3999999999999L252.40000000000015,640.8999999999999L252.90000000000015,639.1999999999998L252.10000000000014,636.3999999999999L251.90000000000015,634.5999999999999L252.10000000000014,632.6999999999999L259.40000000000015,620.9999999999999L265.90000000000015,607.3999999999999L265.90000000000015,606.1999999999998L265.00000000000017,604.9999999999998L262.70000000000016,604.0999999999998L261.60000000000014,603.4999999999998L261.40000000000015,602.0999999999998L262.20000000000016,600.0999999999998L265.00000000000017,596.9999999999998L266.50000000000017,594.3999999999997L276.90000000000015,594.3999999999997L278.00000000000017,593.5999999999998L278.3000000000002,581.7999999999998L278.70000000000016,567.3999999999999L279.3000000000002,564.9999999999999L281.20000000000016,563.9999999999999L292.50000000000017,562.8999999999999L299.8000000000002,560.4999999999999L301.8000000000002,560.4999999999999L312.70000000000016,561.5999999999999L315.40000000000015,561.3L320.3000000000001,559.5999999999999L324.0000000000001,557.5999999999999L327.8000000000001,556.1999999999999L332.8000000000001,556.4L350.5000000000001,560.1999999999999L356.5000000000001,560.1999999999999Z"
    let d12="M914.4,556.9L904.9,558.6L899.1999999999999,560.1L894.9,565L890.6999999999999,567.9L887.3,567.9L886.4,564L885.4,560.6L881.1999999999999,559.1L875.4,557.7L870.6999999999999,554.7L865.9,552.3000000000001L861.6999999999999,548.9000000000001L856.9,545.9000000000001L853.1,547.4000000000001L853.1,551.3000000000001L850.7,553.8000000000001L851.7,556.7L856.4000000000001,562.6L857.4000000000001,566.5L855.0000000000001,569.4L850.7000000000002,569.4L845.5000000000001,568.4L843.6000000000001,569.4L842.6000000000001,573.3L841.2000000000002,575.3L840.2000000000002,578.1999999999999L838.3000000000002,578.6999999999999L836.4000000000002,577.1999999999999L834.1000000000003,574.3L830.3000000000003,573.3L826.0000000000003,574.3L823.6000000000004,576.3L822.6000000000004,578.6999999999999L819.3000000000004,579.1999999999999L817.4000000000004,581.5999999999999L816.9000000000004,585.0999999999999L815.0000000000005,588.4999999999999L812.2000000000005,590.3999999999999L807.0000000000005,591.8999999999999L803.1000000000005,591.3999999999999L798.4000000000004,588.4999999999999L796.5000000000005,589.9999999999999L793.6000000000005,591.3999999999999L790.3000000000005,591.3999999999999L787.0000000000006,591.8999999999999L784.6000000000006,593.8999999999999L784.6000000000006,597.7999999999998L785.6000000000006,601.6999999999998L783.2000000000006,604.5999999999998L779.4000000000007,607.0999999999998L777.9000000000007,609.9999999999998L777.9000000000007,612.8999999999997L775.6000000000007,613.3999999999997L773.2000000000007,612.3999999999997L769.9000000000008,611.8999999999997L768.4000000000008,613.3999999999997L768.0000000000008,616.2999999999997L765.6000000000008,617.2999999999997L762.7000000000008,617.2999999999997L761.3000000000009,618.7999999999997L761.3000000000009,620.6999999999997L759.9000000000009,623.1999999999997L756.5000000000009,622.1999999999997L752.3000000000009,619.2999999999997L748.5000000000009,615.3999999999997L746.1000000000009,615.3999999999997L743.200000000001,612.3999999999997L739.900000000001,610.9999999999998L730.900000000001,610.9999999999998L724.200000000001,614.3999999999997L720.900000000001,614.3999999999997L719.400000000001,615.8999999999997L718.000000000001,618.2999999999997L715.2000000000011,618.2999999999997L712.3000000000011,615.8999999999997L708.0000000000011,614.3999999999997L703.3000000000011,613.8999999999997L700.9000000000011,613.8999999999997L696.3000000000011,615.6999999999997L689.2000000000011,617.7999999999997L686.000000000001,616.8999999999997L682.900000000001,613.2999999999997L682.100000000001,608.9999999999998L682.400000000001,603.9999999999998L681.800000000001,599.8999999999997L678.500000000001,598.3999999999997L678.500000000001,597.3999999999997L685.100000000001,594.9999999999998L683.000000000001,593.1999999999998L683.300000000001,590.9999999999998L684.000000000001,588.6999999999998L683.400000000001,586.4999999999998L682.400000000001,584.7999999999997L683.000000000001,583.2999999999997L682.900000000001,582.4999999999998L682.100000000001,581.8999999999997L679.900000000001,580.5999999999998L679.000000000001,578.9999999999998L676.800000000001,579.0999999999998L676.200000000001,578.4999999999998L676.1000000000009,577.0999999999998L675.0000000000009,574.4999999999998L674.9000000000009,571.9999999999998L675.6000000000009,570.5999999999998L676.9000000000009,569.0999999999998L678.5000000000009,566.3999999999997L677.0000000000009,563.7999999999997L675.5000000000009,563.4999999999998L673.8000000000009,564.4999999999998L671.8000000000009,565.3999999999997L665.6000000000008,564.1999999999997L659.0000000000008,564.1999999999997L657.5000000000008,565.0999999999997L656.1000000000008,568.9999999999997L654.0000000000008,569.8999999999996L655.1000000000008,566.2999999999996L653.0000000000008,565.5999999999996L649.8000000000008,566.4999999999995L647.4000000000008,567.6999999999996L646.6000000000008,568.6999999999996L645.7000000000008,570.6999999999996L644.1000000000008,570.9999999999995L642.2000000000008,570.3999999999995L641.2000000000008,569.1999999999995L641.7000000000008,566.3999999999995L639.0000000000008,568.3999999999995L638.9000000000008,577.2999999999995L635.1000000000008,579.0999999999995L635.2000000000008,580.5999999999995L633.2000000000008,580.5999999999995L632.2000000000008,580.3999999999994L631.0000000000008,579.4999999999994L630.5000000000008,578.4999999999994L630.0000000000008,575.8999999999994L629.5000000000008,574.9999999999994L628.8000000000008,574.4999999999994L626.5000000000008,573.5999999999995L624.9000000000008,572.4999999999994L624.2000000000007,571.5999999999995L624.1000000000007,570.5999999999995L624.7000000000007,567.7999999999995L624.6000000000007,566.3999999999995L624.1000000000007,565.6999999999995L622.3000000000008,564.4999999999994L621.9000000000008,563.7999999999994L622.1000000000008,562.9999999999994L623.5000000000008,560.9999999999994L623.9000000000008,560.1999999999995L623.9000000000008,559.0999999999995L623.4000000000008,558.5999999999995L622.5000000000008,558.2999999999995L620.4000000000008,558.3999999999995L616.4000000000008,559.0999999999996L614.4000000000008,559.1999999999996L612.3000000000008,558.6999999999996L611.3000000000008,558.1999999999996L611.0000000000008,557.3999999999996L611.2000000000008,556.6999999999996L613.0000000000008,553.9999999999995L613.2000000000008,553.0999999999996L613.2000000000008,550.0999999999996L613.4000000000009,549.1999999999996L614.2000000000008,547.7999999999996L617.2000000000008,544.7999999999996L618.0000000000008,543.2999999999996L617.3000000000008,542.5999999999996L615.6000000000007,542.0999999999996L613.2000000000007,541.1999999999996L611.3000000000008,540.8999999999996L609.6000000000007,541.3999999999996L608.2000000000007,542.2999999999996L607.3000000000008,542.4999999999997L606.3000000000008,542.3999999999996L605.2000000000007,541.4999999999997L604.8000000000008,540.5999999999997L604.8000000000008,539.5999999999997L605.1000000000007,538.7999999999997L606.2000000000007,537.2999999999997L606.4000000000008,536.4999999999998L606.4000000000008,534.8999999999997L607.0000000000008,533.1999999999997L607.2000000000008,532.1999999999997L606.7000000000008,531.5999999999997L606.0000000000008,531.2999999999997L604.2000000000008,531.2999999999997L602.5000000000008,531.0999999999997L601.7000000000008,531.2999999999997L600.6000000000008,532.4999999999998L600.0000000000008,534.0999999999998L599.4000000000008,534.6999999999998L596.7000000000007,534.9999999999998L593.1000000000007,536.5999999999998L591.9000000000007,534.8999999999997L590.9000000000007,531.6999999999997L590.0000000000007,530.2999999999997L587.3000000000006,528.0999999999997L583.4000000000007,526.0999999999997L579.3000000000006,524.5999999999997L575.9000000000007,523.9999999999997L573.7000000000006,524.3999999999996L570.4000000000007,526.2999999999996L568.5000000000007,527.1999999999996L566.8000000000006,527.4999999999995L564.0000000000007,527.1999999999996L562.3000000000006,527.2999999999996L559.0000000000007,528.0999999999996L551.5000000000007,531.9999999999995L542.1000000000007,534.0999999999996L539.1000000000007,535.3999999999995L530.1000000000007,541.0999999999996L520.6000000000007,544.4999999999995L517.8000000000008,545.1999999999996L514.8000000000008,544.7999999999996L510.9000000000008,542.8999999999996L497.80000000000075,533.4999999999997L496.2000000000007,531.6999999999997L495.1000000000007,529.4999999999997L493.0000000000007,522.1999999999997L491.40000000000066,518.9999999999997L489.20000000000067,516.2999999999996L486.10000000000065,513.6999999999996L479.20000000000067,510.4999999999996L472.5000000000007,509.9999999999996L465.90000000000066,511.6999999999996L456.0000000000007,517.2999999999996L454.0000000000007,517.9999999999997L451.70000000000067,517.1999999999997L445.0000000000007,513.0999999999997L443.90000000000066,511.79999999999967L440.80000000000064,500.99999999999966L439.30000000000064,497.89999999999964L437.30000000000064,495.0999999999996L434.60000000000065,492.89999999999964L435.30000000000064,490.69999999999965L438.2000000000006,485.5999999999996L440.1000000000006,482.89999999999964L442.4000000000006,480.49999999999966L444.0000000000006,479.79999999999967L446.0000000000006,479.49999999999966L449.0000000000006,479.19999999999965L450.60000000000065,478.49999999999966L458.10000000000065,476.5999999999997L458.80000000000064,476.1999999999997L462.60000000000065,473.0999999999997L472.20000000000067,463.8999999999997L472.60000000000065,463.0999999999997L473.30000000000064,459.8999999999997L473.2000000000006,456.8999999999997L473.80000000000064,453.9999999999997L474.7000000000006,453.2999999999997L477.7000000000006,451.9999999999997L479.0000000000006,449.7999999999997L480.5000000000006,442.89999999999975L480.5000000000006,440.09999999999974L480.10000000000065,436.7999999999997L478.70000000000067,429.39999999999975L477.90000000000066,416.69999999999976L477.10000000000065,413.69999999999976L475.0000000000006,410.69999999999976L471.30000000000064,399.7999999999998L471.5000000000006,368.19999999999976L491.60000000000065,363.2999999999998L499.40000000000066,357.7999999999998L504.20000000000067,351.9999999999998L507.10000000000065,349.39999999999975L509.60000000000065,348.09999999999974L516.3000000000006,345.9999999999997L523.3000000000006,352.59999999999974L524.8000000000006,355.7999999999997L527.7000000000006,358.09999999999974L530.4000000000007,359.59999999999974L600.9000000000007,386.4999999999997L608.9000000000007,387.7999999999997L653.3000000000006,387.09999999999974L655.1000000000006,386.19999999999976L697.6000000000006,355.4999999999998L698.9000000000005,354.7999999999998L700.6000000000006,354.19999999999976L744.4000000000005,362.2999999999998L751.4000000000005,362.19999999999976L775.7000000000005,359.09999999999974L777.7000000000005,358.09999999999974L779.7000000000005,355.89999999999975L793.0000000000005,335.4999999999998L805.4000000000004,303.9999999999998L805.7000000000004,302.4999999999998L805.7000000000004,301.2999999999998L804.9000000000004,297.3999999999998L803.8000000000004,294.6999999999998L786.8000000000004,271.8999999999998L786.4000000000004,270.6999999999998L788.1000000000005,270.3999999999998L793.2000000000005,268.8999999999998L795.7000000000005,268.49999999999983L797.2000000000005,268.99999999999983L798.5000000000005,270.29999999999984L800.6000000000005,272.99999999999983L809.5000000000005,278.29999999999984L812.3000000000004,280.39999999999986L814.1000000000004,281.4999999999999L817.9000000000003,282.2999999999999L819.6000000000004,283.2999999999999L821.0000000000003,284.8999999999999L821.8000000000003,286.49999999999994L825.5000000000003,299.8999999999999L825.6000000000004,301.69999999999993L827.9000000000003,303.0999999999999L833.3000000000003,309.5999999999999L836.2000000000003,311.9999999999999L846.4000000000003,316.89999999999986L855.4000000000003,323.9999999999999L856.6000000000004,328.89999999999986L859.8000000000004,331.79999999999984L860.8000000000004,334.09999999999985L862.1000000000004,335.99999999999983L864.5000000000003,337.09999999999985L867.1000000000004,337.59999999999985L868.9000000000003,337.6999999999999L868.0000000000003,339.7999999999999L867.3000000000003,340.9999999999999L867.0000000000003,342.0999999999999L867.4000000000003,343.8999999999999L868.5000000000003,344.8999999999999L870.2000000000004,345.2999999999999L871.4000000000004,346.2999999999999L871.3000000000004,349.0999999999999L870.4000000000004,350.5999999999999L867.2000000000004,353.5999999999999L866.0000000000003,355.3999999999999L865.7000000000004,357.0999999999999L865.5000000000003,359.0999999999999L865.1000000000004,360.9999999999999L863.9000000000003,361.9999999999999L860.8000000000003,363.89999999999986L859.8000000000003,366.79999999999984L860.2000000000003,370.29999999999984L862.1000000000003,377.59999999999985L862.5000000000002,380.99999999999983L862.2000000000003,388.29999999999984L864.3000000000003,388.6999999999998L879.4000000000003,394.29999999999984L880.5000000000003,396.49999999999983L879.8000000000003,398.59999999999985L877.5000000000003,399.49999999999983L878.8000000000003,401.79999999999984L880.3000000000003,403.89999999999986L882.3000000000003,405.59999999999985L888.7000000000003,407.89999999999986L891.0000000000002,409.39999999999986L892.6000000000003,411.89999999999986L898.6000000000003,425.9999999999999L898.9000000000002,429.6999999999999L897.7000000000002,436.39999999999986L894.1000000000001,449.29999999999984L894.1000000000001,456.1999999999998L895.7000000000002,460.49999999999983L898.3000000000002,463.1999999999998L901.3000000000002,465.49999999999983L904.2000000000002,468.8999999999998L905.2000000000002,472.0999999999998L905.1000000000001,475.4999999999998L904.2000000000002,482.19999999999976L901.6000000000001,489.69999999999976L896.2000000000002,495.2999999999998L882.3000000000002,503.0999999999998L884.6000000000001,504.9999999999998L886.8000000000002,508.2999999999998L890.1000000000001,514.7999999999997L892.1000000000001,520.7999999999997L895.7000000000002,526.4999999999998L898.7000000000002,529.8999999999997L908.0000000000001,536.6999999999997L909.1000000000001,537.8999999999997L910.5000000000001,540.3999999999997L911.4000000000001,541.4999999999998L913.1000000000001,542.2999999999997L914.6000000000001,542.4999999999998L915.9000000000001,543.0999999999998L917.0000000000001,544.9999999999998L916.7000000000002,547.9999999999998L914.4000000000002,556.8999999999997Z"
    let d13="M228.5,291.4L233.7,286.79999999999995L237.39999999999998,285.9L277.2,285.59999999999997L279.59999999999997,286.09999999999997L279.59999999999997,287.59999999999997L279.7,289.79999999999995L280.2,291.69999999999993L281.3,292.8999999999999L283.1,293.69999999999993L284.20000000000005,294.69999999999993L285.1,297.29999999999995L286.20000000000005,298.49999999999994L286.90000000000003,298.99999999999994L290.90000000000003,300.79999999999995L293.70000000000005,302.69999999999993L294.6,304.0999999999999L294.8,304.9999999999999L294.90000000000003,307.1999999999999L295.70000000000005,309.39999999999986L298.6,311.6999999999999L302.70000000000005,310.39999999999986L311.30000000000007,310.09999999999985L315.80000000000007,310.49999999999983L319.4000000000001,312.79999999999984L321.80000000000007,313.6999999999998L323.30000000000007,313.8999999999998L334.00000000000006,312.8999999999998L336.1000000000001,313.0999999999998L337.50000000000006,313.3999999999998L338.6000000000001,314.8999999999998L339.4000000000001,324.99999999999983L340.4000000000001,328.59999999999985L344.6000000000001,333.29999999999984L350.50000000000006,336.79999999999984L347.00000000000006,352.1999999999998L342.1000000000001,357.5999999999998L339.80000000000007,351.7999999999998L336.1000000000001,348.69999999999976L314.6000000000001,340.09999999999974L309.4000000000001,337.7999999999997L305.6000000000001,333.89999999999975L302.6000000000001,333.4999999999998L298.1000000000001,334.9999999999998L294.7000000000001,335.39999999999975L286.6000000000001,329.4999999999998L286.00000000000006,329.9999999999998L283.90000000000003,331.0999999999998L282.50000000000006,332.2999999999998L281.80000000000007,333.9999999999998L281.00000000000006,348.19999999999976L280.6000000000001,350.19999999999976L279.80000000000007,351.69999999999976L271.00000000000006,360.4999999999998L270.30000000000007,360.89999999999975L266.30000000000007,362.7999999999997L260.80000000000007,364.1999999999997L247.20000000000007,365.5999999999997L245.00000000000009,365.6999999999997L227.3000000000001,362.4999999999997L224.9000000000001,361.7999999999997L223.4000000000001,361.09999999999974L221.60000000000008,359.2999999999997L219.50000000000009,357.7999999999997L218.00000000000009,357.09999999999974L212.60000000000008,355.2999999999997L207.20000000000007,354.6999999999997L205.50000000000009,354.7999999999997L197.00000000000009,356.59999999999974L194.70000000000007,356.39999999999975L193.30000000000007,355.59999999999974L190.40000000000006,353.19999999999976L188.90000000000006,352.7999999999998L175.10000000000005,352.0999999999998L167.90000000000006,352.6999999999998L165.80000000000007,353.3999999999998L163.80000000000007,356.5999999999998L160.40000000000006,355.4999999999998L152.30000000000007,351.7999999999998L150.30000000000007,350.5999999999998L149.40000000000006,349.1999999999998L149.20000000000007,347.29999999999984L151.10000000000008,344.59999999999985L153.4000000000001,341.99999999999983L154.3000000000001,340.3999999999998L154.7000000000001,338.99999999999983L154.3000000000001,336.99999999999983L153.9000000000001,336.1999999999998L152.7000000000001,335.0999999999998L151.2000000000001,334.3999999999998L150.0000000000001,333.2999999999998L149.7000000000001,332.5999999999998L150.0000000000001,329.7999999999998L150.5000000000001,327.8999999999998L150.5000000000001,326.3999999999998L149.6000000000001,325.1999999999998L148.3000000000001,324.1999999999998L146.7000000000001,323.49999999999983L146.1000000000001,322.99999999999983L145.5000000000001,321.1999999999998L145.2000000000001,319.1999999999998L145.7000000000001,316.49999999999983L145.8000000000001,312.29999999999984L145.3000000000001,310.39999999999986L144.2000000000001,309.29999999999984L141.9000000000001,308.49999999999983L141.3000000000001,308.09999999999985L140.00000000000009,306.79999999999984L139.9000000000001,305.99999999999983L140.60000000000008,302.1999999999998L141.60000000000008,299.5999999999998L143.10000000000008,297.1999999999998L146.10000000000008,295.49999999999983L185.20000000000007,284.29999999999984L186.70000000000007,285.29999999999984L188.60000000000008,286.49999999999983L190.00000000000009,286.99999999999983L192.60000000000008,287.1999999999998L195.00000000000009,286.8999999999998L197.50000000000009,285.99999999999983L198.9000000000001,286.29999999999984L204.4000000000001,290.6999999999998L205.10000000000008,291.0999999999998L207.80000000000007,292.1999999999998L208.80000000000007,292.6999999999998L209.70000000000007,294.3999999999998L209.90000000000006,296.2999999999998L210.70000000000007,297.7999999999998L211.40000000000006,298.2999999999998L213.30000000000007,298.9999999999998L214.70000000000007,299.19999999999976L216.80000000000007,299.09999999999974L218.70000000000007,298.59999999999974L226.50000000000009,294.4999999999997L227.8000000000001,293.4999999999997L228.50000000000009,291.3999999999997Z"
    let d14="M268.7,713.3L267.09999999999997,713.1999999999999L254.29999999999995,714.0999999999999L251.09999999999997,713.5999999999999L240.99999999999997,710.1999999999999L235.29999999999998,709.5999999999999L222.99999999999997,711.8L220.49999999999997,713.0999999999999L219.09999999999997,712.8999999999999L215.59999999999997,711.4999999999999L213.89999999999998,711.1999999999999L212.2,711.4999999999999L201,717.5999999999999L188,724.6999999999999L183.1,726.6999999999999L174.9,726.6999999999999L166.5,728.9L163.5,729L141.5,727.5L135.6,729L131.9,731.5L130.8,729.4L130,727.1999999999999L129.3,723.8L128.3,722.6999999999999L125.9,720.9999999999999L122.10000000000001,717.2999999999998L120.50000000000001,715.1999999999998L119.80000000000001,713.0999999999998L119.80000000000001,706.0999999999998L120.20000000000002,704.5999999999998L121.80000000000001,703.1999999999998L122.10000000000001,701.6999999999998L123.30000000000001,699.8999999999999L131.4,695.0999999999999L134.9,694.8999999999999L139.9,695.3999999999999L145.3,691.9999999999999L147.10000000000002,690.4999999999999L148.00000000000003,689.1999999999999L148.70000000000002,687.8L149.8,686.1999999999999L156,681.5999999999999L159,685.0999999999999L161.3,691.3999999999999L163.5,692.8999999999999L163.6,690.2999999999998L165.29999999999998,688.1999999999998L168.1,687.3999999999999L171.29999999999998,688.0999999999999L176.7,691.1999999999999L181.6,692.5999999999999L187,695.0999999999999L189.8,695.3999999999999L193,693.7999999999998L196.9,688.9999999999999L199.8,687.3999999999999L203.5,687.5999999999999L206.7,688.8L209.89999999999998,689.0999999999999L213.59999999999997,686.8L215.49999999999997,686L216.79999999999998,687.5L217.7,689.6L218.7,690.8000000000001L231.29999999999998,686.1L234.2,685.4L238.1,685.1L240.6,684.4L242.7,682.9L245.1,681.6L248.7,681.8000000000001L251.5,683.3000000000001L255.8,686.7L255.70000000000002,687.7L256.1,692.1L258.40000000000003,697L261.40000000000003,701.3L263.00000000000006,704.9L268.00000000000006,712.3L268.70000000000005,713.3ZM246.29999999999998,665.6999999999999L245.29999999999998,665.6999999999999L245.29999999999998,666.9L245.1,667.6L243.4,671L242.6,672.1L242,677.7L237.5,680.6L230.8,681.8000000000001L229.10000000000002,682.5000000000001L225.8,684.7000000000002L224.8,685.1000000000001L223.10000000000002,685.0000000000001L219.20000000000002,683.9000000000001L213.00000000000003,683.9000000000001L211.20000000000002,684.4000000000001L208.10000000000002,685.7L206.40000000000003,686.2L204.40000000000003,686.2L199.20000000000005,685.1L197.40000000000003,685.5L195.20000000000005,687.1L193.70000000000005,687.4L193.20000000000005,688.1999999999999L192.40000000000003,689.9999999999999L191.30000000000004,691.8999999999999L189.80000000000004,692.9999999999999L183.20000000000005,690.7999999999998L177.80000000000004,687.6999999999998L175.30000000000004,685.5999999999998L174.20000000000005,683.3999999999997L172.10000000000005,682.4999999999998L170.60000000000005,681.7999999999997L169.80000000000004,680.5999999999997L170.10000000000005,678.9999999999997L171.10000000000005,677.4999999999997L172.60000000000005,676.3999999999996L174.20000000000005,676.0999999999997L174.20000000000005,674.7999999999997L171.70000000000005,674.7999999999997L170.10000000000005,673.4999999999998L169.20000000000005,671.4999999999998L168.70000000000005,669.1999999999998L167.60000000000005,682.8999999999999L166.40000000000006,682.8999999999999L164.20000000000007,679.9999999999999L158.30000000000007,674.7999999999998L157.50000000000006,671.4999999999999L155.60000000000005,673.0999999999999L154.40000000000006,674.8999999999999L152.90000000000006,676.4999999999999L150.30000000000007,677.0999999999999L148.40000000000006,676.6999999999999L147.10000000000005,675.5999999999999L146.40000000000006,673.8L146.50000000000006,671.5L148.80000000000007,667.2L152.10000000000008,663.9000000000001L154.20000000000007,660.2L153.20000000000007,654.3000000000001L152.50000000000009,658.8000000000001L152.10000000000008,660.1L151.20000000000007,661.5L149.70000000000007,662.7L146.50000000000009,665.7L145.10000000000008,667.4000000000001L144.4000000000001,669.6000000000001L144.2000000000001,673.1000000000001L145.4000000000001,679.0000000000001L145.00000000000009,681.7000000000002L140.20000000000007,683.8000000000002L133.10000000000008,689.8000000000002L127.60000000000008,691.7000000000002L124.60000000000008,689.9000000000002L123.40000000000008,685.6000000000003L123.10000000000008,680.0000000000002L124.00000000000009,674.1000000000003L126.60000000000008,668.3000000000003L130.70000000000007,665.0000000000003L136.40000000000006,666.9000000000003L136.70000000000007,664.4000000000003L134.30000000000007,662.6000000000004L131.00000000000006,661.9000000000003L128.10000000000005,662.9000000000003L124.80000000000005,667.0000000000003L122.90000000000005,668.4000000000003L120.90000000000005,667.9000000000003L121.90000000000005,666.6000000000004L122.20000000000005,665.1000000000004L121.90000000000005,663.7000000000004L120.90000000000005,662.3000000000004L124.40000000000005,657.4000000000004L125.10000000000005,654.9000000000004L124.30000000000005,652.0000000000005L123.10000000000005,652.0000000000005L122.40000000000005,653.9000000000004L121.20000000000005,654.7000000000004L120.20000000000005,654.0000000000003L119.80000000000004,651.5000000000003L120.20000000000005,649.5000000000003L121.20000000000005,647.4000000000003L126.90000000000005,638.7000000000003L127.50000000000004,636.6000000000003L127.40000000000005,634.5000000000002L126.60000000000005,630.6000000000003L126.40000000000005,628.7000000000003L126.80000000000005,625.2000000000003L128.40000000000006,618.3000000000003L128.70000000000007,613.9000000000003L128.50000000000009,611.1000000000004L127.80000000000008,609.7000000000004L128.00000000000009,605.9000000000004L128.60000000000008,604.0000000000005L129.70000000000007,602.7000000000005L132.20000000000007,600.1000000000005L132.70000000000007,598.5000000000005L135.10000000000008,594.5000000000005L140.80000000000007,593.2000000000005L174.50000000000006,593.5000000000005L266.50000000000006,594.4000000000004L265.00000000000006,597.0000000000005L262.20000000000005,600.1000000000005L261.40000000000003,602.1000000000005L261.6,603.5000000000005L262.70000000000005,604.1000000000005L265.00000000000006,605.0000000000005L265.90000000000003,606.2000000000005L265.90000000000003,607.4000000000005L259.40000000000003,621.0000000000006L252.10000000000002,632.7000000000006L251.90000000000003,634.6000000000006L252.10000000000002,636.4000000000005L252.90000000000003,639.2000000000005L252.40000000000003,640.9000000000005L252.10000000000002,644.4000000000005L251.40000000000003,646.4000000000005L249.70000000000005,648.0000000000006L248.80000000000004,649.1000000000006L248.50000000000003,650.1000000000006L247.10000000000002,660.4000000000005L246.40000000000003,661.9000000000005L246.10000000000002,664.2000000000005L246.3,665.7000000000005Z"



    return [d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14]
  }

}
