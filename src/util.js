
//////////////////////////////////////////////////////////////////////////////
// distance calculation
//////////////////////////////////////////////////////////////////////////////
export function distance(dx, dy)
{
    return Math.sqrt(dx * dx + dy * dy)
}

//////////////////////////////////////////////////////////////////////////////
// Angle conversion -- LD53 uses a different rotation metric for covenience
// in places -- 0 is aligned vertically "north".  Increasing positive values 
// turn clockwise such that each unit is one full revolution.  k
//
// We'll call this unit "UR" for Unit Rotatioj.
//////////////////////////////////////////////////////////////////////////////
export function URtoRadians(ur)
{
    return (.25 - ur) * 2 * Math.PI;
}

export function URtoUX(ur)
{
    return Math.cos(URtoRadians(ur));
}

export function URtoUY(ur)
{
    return Math.sin(URtoRadians(ur));
}

export function RadiansToUR(r)
{
   return .25 - r / 2 / Math.PI
}

export function DeltaToUR(dx, dy)
{
    const slope = -dy / dx;
    const r = -Math.atan(slope);
    return RadiansToUR(r) + (dx < 0 ? 0.5 : 0);
}

//////////////////////////////////////////////////////////////////////////////
// 2D Vectoring and Points
//////////////////////////////////////////////////////////////////////////////
class Delta extends Array
{
    static length = 2;

    get dx()                { return this[0]; }
    get dy()                { return this[0]; }
    
    get mag()               { return Math.sqrt(this.smag); }
    get smag()
    {
        const [ dx, dy ] = this;
        return (dx * dx + dy * dy);
    }        
    
    translate(dx, dy)       { return new Delta(dx + dx, dy + dy); }
    
    scale(s_or_sx, sy)
    {
        if (sy == null)
        {
            return new Delta(s_or_sx * this[0], s_or_sx * this[1]);
        }
        else
        {
            return new Delta(s_or_sx * this[0], sy * this[1]);
        }
    }
    
    rotate(delta)
    {
        return this.ur.rotate(delta).ud.scale(this.mag);
    }
    
    get ux()                { return this[0] / this.mag; }
    get uy()                { return this[1] / this.mag; }
    get ud()                { return new Delta(this[0], this[1]); }
    
    get ur()
    {
        return UnitRotation.fromDelta(...this);
    }
    
    point(o_or_ox, oy)
    {
        if (oy != null)
        {
            return new Point(o_or_ox + this[0], oy + this[1]);
        }
        else if (o_or_ox != null)
        {
            return new Point(o_or_ox[0] + this[0], o_or_ox[1] + this[1]);
        }
    }
}

class UnitRotation extends Number
{
    static fromDelta(dx, dy)
    {
        const slope = -dy / dx;
        const r = -Math.atan(slope);
        return this.fromRadians(r + (dx < 0 ? Math.PI : 0));
    }
    
    static fromRadians(r)
    {
        return new this(.25 - r / 2 / Math.PI);
    }
    
    rotate(r)
    {
        return new UnitRotation(this + r);
    }
    
    get north_radians()     { return this * 2 * Math.PI; }
    get radians()
    {
        return (.25 - this) * 2 * Math.PI;
    } 
    
    get ud()
    {
        const north_rad = this.north_radians;
        return new Delta(Math.sin(north_rad), Math.cos(north_rad));
    }
    
    equals(ur)
    {
        return this % 1 == ur % 1;
    }
    
    static N = new UnitRotation(0);
    static E = new UnitRotation(0.25);
    static S = new UnitRotation(0.5);
    static W = new UnitRotation(-0.25);
}
