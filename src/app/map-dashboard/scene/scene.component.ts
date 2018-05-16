import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'tb-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {
  @ViewChild("svg") svg_ng:any
  @ViewChild("pickedColor") pickedColor:any
  svg: any
  xmlns = 'http://www.w3.org/2000/svg'
  pickedColors = []
  colors = ["#04A0E3", "#E43400", '#E0D000', '#33AC00', '#7B00A7', '#A70000']

  constructor(@Inject(DOCUMENT) private  document: any) {
  }

  ngOnInit() {
    this.svg = this.svg_ng.nativeElement
    this.initRects()
  }

  initRects(){
    for(let i=0;i<6;i++){
      let rect = this.document.createElementNS(this.xmlns,'rect')
      rect.setAttribute('rx',"2")
      rect.setAttribute('ry',"2")
      rect.setAttribute('width',"50")
      rect.setAttribute('height',"26")
      rect.color_ = this.colors[i]
      rect.addEventListener('click', this.pickColor.bind(this))
      this.pickedColors.push(rect)
    }

  }

  offerColors(){
    let dance_ = () => {
      let pos = 27
      let interval = setInterval(move, 5)
      let dist = count*32 + pos

      let rect = this.pickedColors[count]

      let index = count++

      function move() {
          if (pos === dist) {
              clearInterval(interval)
              rect.classList.add('smile'+index)
          } else {
              pos+=8
              if(pos===51)
                rect.setAttribute("opacity", 100)

              rect.setAttribute("y",pos)

              //rect.style.left = pos + 'px'
          }
      }

    }
    let dance = () => {
      let pos = 27
      pos = count*32 + pos
      
      let rect = this.pickedColors[count]
      let index = count++
      rect.setAttribute("y",pos)
      rect.classList.add('smile'+index)
      
      if(count===6)
        clearInterval(turn)

    }

    let pickedColor = this.pickedColor.nativeElement.getAttribute('fill')
    let cover = this.document.createElementNS(this.xmlns,'rect')
    cover.setAttribute('rx',"2")
    cover.setAttribute('ry',"2")
    cover.setAttribute('x',"80")
    cover.setAttribute('y',"-27")
    cover.setAttribute('width',"50")
    cover.setAttribute('height',"26")
    cover.setAttribute('fill', pickedColor)
    cover.setAttribute('opacity', 0.5)
    cover.addEventListener('click', this.cancel.bind(this))
    this.svg.appendChild(cover)

    let count = 0
    for(let i=5;i>-1;i--){
      let rect = this.pickedColors[i]
      rect.setAttribute('fill',pickedColor)
      rect.setAttribute('x',"80")
      rect.setAttribute('y',"27")
      rect.setAttribute('opacity', 0)
      rect.classList.remove('fade'+i)
      this.svg.appendChild(rect)
    }

    this.pickedColor.nativeElement.setAttribute('fill', this.colors[0])
    this.pickedColor.nativeElement.previousPick = pickedColor
    console.log(pickedColor)

    cover.classList.add('expand')

    let turn = setInterval(dance, 200)
  }

  cancel(e){
    
    e.target.remove()

  }

  pickColor(e){
    let talkingColors = ['#56CCFF', '#FF6336', '#FEF248', '#9DFF74', '#D358FF', '#FE2A2A']

    if(e.target)
      var pickedColor = e.target.color_
    else
      var pickedColor = e

    this.pickedColor.nativeElement.setAttribute('fill', pickedColor)
    console.log(e.target)

    for(let i=0;i<6;i++){
      this.pickedColors[i].setAttribute('fill', this.pickedColors[i].color_)
      this.pickedColors[i].setAttribute('class', 'fade'+i)
    }

    let interval = setInterval(() => {
      clearInterval(interval)
      for(let rect of this.pickedColors)
        rect.remove()
    
    }, 1200)
  }

}
