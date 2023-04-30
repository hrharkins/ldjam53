
import Directive from "./directive.js";

//////////////////////////////////////////////////////////////////////////////
// Game engine -- manages the models, handles events, and produces snapshots.
//////////////////////////////////////////////////////////////////////////////
export default class LD53Game
{
    constructor()
    {
        this.actors.test = new TestActor().jumpTo(0, 5);
        window.t = this.actors.solider1 = new Soldier();
        this.actors.solider2 = new Soldier().jumpTo(5, 0);
        this.actors.truck1 = new Truck().jumpTo(10, 0);
        this.actors.factory1 = new Factory().jumpTo(-7, 0);
        this.actors.barracks1 = new Barracks().jumpTo(0, -10);
    }
    
    actors = {}
    
    tick(now)
    {
        const snapshot = {};
        for (var [id, actor] of Object.entries(this.actors))
        {
            snapshot[id] = actor.tick(now, this);
        }
        return snapshot;
    }
    
    filter(filter)
    {
        const filtered = {};
        for (const [id, actor] of Object.entries(this.actors))
        {
            if(filter(actor, id))
            {
                filtered[id] = actor;
            }
        }
        return filtered;
    }
}

class Actor
{
    x = 0; y = 0;
    r = 0;              // 1 = one full clockwise revoluttion
    sx = 1; sy = 1; s = 1;
    vx = 0; vy = 0; v = 0;
    ax = 0; ay = 0; a = 0;
    maxv = 0.2; thrust = 0.05;
    turn = 1;
    target = null;
    lasttick = null;
    selectable = true;
    currentDirective = null;
    queuedDirectives = [];
    standingDirective = new Directive.types.halt();
    
    halt(directive)
    {
    }
    
    jumpTo(x, y)
    {
        this.x = x == null ? this.x : x;
        this.y = y == null ? this.y : y;
        return this;
    }
    
    setTarget(x, y)
    {
        this.target = [x, y];
        return this;
    }
    
    nextDirective()
    {
        var directive = this.queuedDirectives.shift();
    
        if (!directive)
        {
            directive = this.standingDirective;
        }
        
        this.currentDirective = directive;
        
        return directive;
    }
    
    tick(now, game)
    {
        var directive = this.currentDirecrtivew;
        
        if (!directive)
        {
            directive = this.nextDirective();
        }
        
        directive.applyTo(this);
        
        if (this.lasttick != null)
        {
            const dt = now - this.lasttick;
            
            const target = this.target;
            if (!!target)
            {
                this.moveToward(dt, ...target);
            }
            
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
            
            /* global URtoUX, URtoUY */
            const ux = URtoUX(this.r);
            const uy = URtoUY(this.r);
            this.x += this.v * ux;
            this.y += this.v * uy;
            this.v = Math.min(this.maxv, this.v + this.a);
        }
        this.lasttick = now
        
        return { 
            role: this.role,
            x: this.x,
            y: this.y,
            sx: this.s * this.sx,
            sy: this.s * this.sy,
            r: -this.r,
            selectable: this.selectable,
        }
    }
    
    moveToward(dt, x, y)
    {
        // What rotation is needed?
        /* global DeltaToUR, distance */
        const dx = x - this.x, dy = y - this.y;
        const d = distance(dx, dy);
        if (d > 0.1)
        {
            const ta = DeltaToUR(dx, dy);
            var dr = ta - this.r;
            if (dr > 0.5)
            {
                dr -= 1;
            }
            if (Math.abs(dr) > this.turn * dt * 1.25)
            {
                this.r += dt * this.turn * Math.sign(dr);
            }
            else
            {
                this.r = ta;
                this.a = this.thrust;
            }                
        }
        else
        {
            this.a = this.v = 0;
        }
    }
}

class TestActor extends Actor
{
    role = 'generic';
    
    tick(now, game)
    {
        this.r = now;
        this.s = Math.sin(now);
        this.ax = Math.cos(now);
        this.ay = Math.cos(now);
        return super.tick(now, game);
    }
}

class PathingActor extends Actor
{
    
}

class PlayerUnit extends Actor
{
    selectable = true;
}

class Soldier extends PlayerUnit
{
    role = 'soldier';
    
    tick(now)
    {
        return super.tick(now);
    }
}

class Truck extends PlayerUnit
{
    role = 'truck';
    
    tick(now)
    {
        return super.tick(now);
    }
}

class Factory extends PlayerUnit
{
    role = 'factory';
    
    tick(now)
    {
        return super.tick(now);
    }
}

class Barracks extends PlayerUnit
{
    role = 'barracks';
    
    tick(now)
    {
        return super.tick(now);
    }
}

