
//////////////////////////////////////////////////////////////////////////////
// Game engine -- manages the models, handles events, and produces snapshots.
//////////////////////////////////////////////////////////////////////////////
export default class LD53Game
{
    constructor()
    {
        this.actors.test = new TestActor();
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
}

class Actor
{
    x = 0; y = 0;
    r = 0;              // 1 = one full clockwise revoluttion
    
    tick(now, game)
    {
        return { 
            role: this.role,
            x: this.x,
            y: this.y,
            r: this.r,
        }
    }
}

class TestActor extends Actor
{
    role = 'generic';
    
    tick(now, game)
    {
        if (now < 5)
        {
            this.y = now;
        }
        this.r = now;
        return super.tick(now, game);
    }
}
