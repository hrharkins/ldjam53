
//////////////////////////////////////////////////////////////////////////////
// Game engine -- manages the models, handles events, and produces snapshots.
//////////////////////////////////////////////////////////////////////////////
export default class LD53Game
{
    constructor()
    {
        this.actors.test = new TestActor().jumpTo(0, 5);
        this.actors.solider1 = new Soldier();
        this.actors.solider2 = new Soldier().jumpTo(5, 0);
        this.actors.truck1 = new Truck().jumpTo(10, 0);
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
    vx = 0; vy = 0;
    ax = 0; ay = 0;
    lasttick = null;
    selectable = true;
    
    jumpTo(x, y)
    {
        this.x = x == null ? this.x : x;
        this.y = y == null ? this.y : y;
        return this;
    }
    
    tick(now, game)
    {
        if (this.lasttick != null)
        {
            const dt = now - this.lasttick;
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.vx += this.ax * dt;
            this.vy += this.ay * dt;
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
