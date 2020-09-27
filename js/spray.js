class Spray {
    constructor(){
        this.current = [0,0]
        this.routes = []
        this.goFaster = false
        this.limits = [window.innerWidth-130, min(800, window.innerHeight-130)]
    }
    
    addRoute(route){
        this.routes.push(route)
    }

    addNewRoute(){
        let radius  = rand(500)
        let speed   = random(3) + 1
        let tx      = random(2) > 1 ? 1 : -1
        let ty      = random(2) > 1 ? 1 : -1
        let scx     = random(2) 
        let scy     = random(2)
        let k       = rand(90)
        let p       = rand(90) + 10

        return [radius, speed, tx, ty, scx, scy, k, p]
    }

    runAnimation(frameFunc) {
        function frame(time){
              if (frameFunc() === true) return;
           requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }  

    async start(){
         if (this.routes.length == 0) this.routes.push(this.addNewRoute())

         for (let i=0; i<this.routes.length;){
             let status = await this.run(this.routes[i])
             if (status == true) {
                 if (i == this.routes.length - 1){
                      this.routes[i] = this.addNewRoute()
                 }
                 else  i++
             }
         }
         
        // console.log('finished')
    }
	
	isOut(dist, t){
		return dist[t] < 0 || dist[t] > this.limits[t]
	}
	
    checkCoord(dist, t){    // check, whether spray is out of specified borders
		let move = dist[t]
		
		while (move < 0 || move > this.limits[t]){
		  if (move < 0){
		  	move = abs(move)      // if spray crosses the border, it should reverse its direction
		  }					
	      if (move > this.limits[t]){
		  	move = this.limits[t] - abs(move  - this.limits[t])   // do the same thing
		  }
	    }
		
		return move
	}
	
	calcXY(radius, currentDegree, k, tx, ty, scx, scy){
		let x,y,hyp2,hyp,deg2,deg
		
		// use some math to calculate x and y in each step. More formally , use cosines theorem to calculate c, when we know a,b and angle between them
       
		hyp2 = 2 * radius * radius * (1 - cos(currentDegree / 57))  
		hyp  = sqrt(hyp2) 
        deg2 = (180 - currentDegree) / 2
        deg  = 180 - (deg2 + k)
			
        x = hyp * cos(deg / 57)
        y = hyp * sin(deg / 57)
		
        x = tx * x * scx    // specify direction, change x by scx times
        y = ty * y * scy 
			
		return [x,y]
	}

    run(route){
        let [radius,  // radius of circular path
             speed,   // by default, spray stops moving after 500 steps. by giving speed number of steps will be changed like this - steps = 500 / speed
             tx,      // +1 or -1 e.g. direction on x-axis (+1 - spray moves from left to right and vice versa)
             ty,      // +1 or -1 e.g. direction on y-axis
             scx,     // e.g. scaled X. distance on x-axis, spray covers, will be multiflied on scx, and this will cause elliptic movement
             scy,     // e.g. scaled Y. same way, distance on y-axis will be increased by scy times and this will change moving trajectory
             k = 0,   // e.g. Angle on clockwise. If we consider the half circle, this is an angle , which a diameter of the circle makes toward the X-axis
             p,       // e.g. specify when to stop.. should be in range [0, 100]. if p = 50, then spray stops moving when it covers 50% of its path 
			] = route  

        let steps = 500 / speed 
        let currentStep = 1 
        let degree = 90 * (1 / steps) 
        let currentDegree = degree
        let dist = [this.current[0], this.current[1]], move = [0,0]
        let self = this
        let itsway = 180 * (p / 100) 

	 
        return new Promise(resolve => {
           self.runAnimation(() => {
                if (currentDegree >= itsway){
					self.current = [move[0], move[1]]
                    resolve(true)
                    return true 
                }

                if (this.goFaster) currentDegree += degree

                let[x,y] = self.calcXY(radius, currentDegree, k, tx, ty, scx, scy)         
				
				dist = [self.current[0] +x, self.current[1] +y]  // find the x and y (coordinates) , where spray has to go next

				move = [self.checkCoord(dist,0), self.checkCoord(dist,1)]  // if one of the coordinates is out of borders, then find its symmetric point if we consider crossed border as a X or Y-axis
                
                st($1(self.element),    // set final x and y coordinates to spray. 
                    `tr:rotate(180deg) translateX(${move[0]}px) translateY(${move[1]}px)`) 
              

                currentDegree += degree / 40     // just -  currentDegree += degree  - would work, but we want to create an effect of acceleration
                currentDegree += degree * sin(currentStep / 57)
                currentStep = 180 * (currentDegree / itsway)
                return false
           })
        })
    }

    moveAway(){
        this.goFaster = true
    }


    slowDown(){
        this.goFaster = false
    }


    create(params){
        let [imagePath, uniqueId, parent] = params
        this.element = uniqueId 

        let self = this
        let c = `<div class='position-absolute'>
                       <img src='${imagePath}' class='spray' id='${uniqueId}'/>
                  </div>`

        $1(parent).innerHTML = c + $1(parent).innerHTML
    }
}
