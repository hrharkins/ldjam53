
//////////////////////////////////////////////////////////////////////////////
// distance calculation
//////////////////////////////////////////////////////////////////////////////
function distance(dx, dy)
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
function URtoRadians(ur)
{
    return (.25 - ur) * 2 * Math.PI;
}

function URtoUX(ur)
{
    return Math.cos(URtoRadians(ur));
}

function URtoUY(ur)
{
    return Math.sin(URtoRadians(ur));
}

function RadiansToUR(r)
{
   return .25 - r / 2 / Math.PI
}

function DeltaToUR(dx, dy)
{
    const slope = -dy / dx;
    const r = -Math.atan(slope);
    return RadiansToUR(r) + (dx < 0 ? 0.5 : 0);
}
