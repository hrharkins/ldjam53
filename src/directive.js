
//////////////////////////////////////////////////////////////////////////////
// Actions/Orders (Directives)
//////////////////////////////////////////////////////////////////////////////

export default class Directive
{
    appliesTo(unit)
    {
        return unit[this.method_name];
    }
    
    applyTo(unit)
    {
        unit[this.method_name](this);
    }
    
    static types = {};
}

Directive.types.halt =
class HaltDirective extends Directive
{
    method_name = "halt";
}

class TargetedDirective extends Directive
{
    constructor(target)
    {
        this.target = target;
    }
}

Directive.types.action = 
class MoveActorDirective extends TargetedDirective
{
    method_name="move";
}





