/* global React */
/* global ReactDOM */
/* global ReactBootstrap */
/* global ReactBootstrapIcons */
const RB = ReactBootstrap;
//const RBI = ReactBootstrapIcons;
import LD53Game from "./engine.js";

// Still can't import JSX in standalone babel.  Not sure how to foce the
// config that would be in babelrc to map jsx to react... :(
//import TestComp from "./TestMod.jsx";

//////////////////////////////////////////////////////////////////////////////
// Actor roles -- add/change these to make display updates.
//////////////////////////////////////////////////////////////////////////////

const roles = {};

function Role(props)
{
    const { 
        id,
        actor,
        now,
        x=0, 
        y=0, 
        r=0, 
        s=1, 
        sx=1, 
        sy=1,
        selectable=false,
    } = props;
    
    const 
    {
        engine,
        selected, 
        setSelected ,
    } = React.useContext(Playfield.Context);
    
    const [ lastClick, setLastClick ] = React.useState();
    function handleClick(event)
    {
        const last = lastClick;
        setLastClick(now);
        if (now - last < .25)
        {
            return;
        }
        console.log("SINGLE");
        event.stopPropagation();
        event.preventDefault();
        const nowSelected = {
            ...(event.shiftKey ? selected : {})
        };
        nowSelected[id] = event.shiftKey ? !nowSelected[id] : true;
        console.log(nowSelected);
        setSelected(nowSelected);
    }
    
    function handleDoubleClick(event)
    {
        event.stopPropagation();
        event.preventDefault();
        const role = actor.role;
        const group = engine.filter(
            (check) => (check.role == role)
        );
        const nowSelected = { ...(event.shiftKey ? selected : {}) };
        for (const id of Object.keys(group))
        {
            nowSelected[id] = event.shiftKey ? !nowSelected[id] : true;
        }
        console.log(nowSelected);
        setSelected(nowSelected);
    }
    
    const eventProps =
    {
        pointerEvents: 'bounding-box'
    };
    
    if (selectable)
    {
        eventProps.onClick = handleClick;
        eventProps.onDoubleClick = handleDoubleClick;
        eventProps.cursor = 'pointer';
    }
    
    return <g transform={`
        translate(${x},${y})
        rotate(${r * 360})
        scale(${sx}, ${sy})
    `} {...eventProps}>
        {
            selected[id]
            ? <circle strokeDasharray='4 2'
                      strokeDashoffset={`${now * 100 % 100}%`}
                      r={1.25} strokeWidth='3'/>
                      
            : null
        }
        {props.children}
    </g>;
}

roles.generic = function GenericRole(props)
{
    return <Role {...props}>
        <line y1={0.5}/>
        <circle r={0.5}/>
    </Role>;
};


roles.soldier = function SoldierRole(props)
{
    const { actor: soldier } = props;
    return <Role {...props}>
        <g fill="grey"
            stroke="gold"
            strokeWidth=".2"
        >
            <polygon points={`
                -.5,.3
                .5,.3
                .5,-.3
                -.5,-.3
            `}/>
            //Body
            <polygon points={`
                -.25,-.25
                .25,-.25
                .25,.25
                -.25,.25
            `}
                fill="green"
            />
            //Head
            
             <polygon points={`
                -.5,-.3
                -.45,-.55
                .45,-.55
                .5, -.3
            `}
            fill="brown"
            />
            //BackPack
            
            {
                (!!soldier.holding)
                ? (
                    <polygon points={`
                        .25,.3
                        -.25,.3
                        -.25,.8
                        .25, .8
                    `}
                    fill="black"
                    />
                ) : (
                    (!!soldier.sight)
                ? (
                    <polygon points={`
                        .1,.3
                        -.1,.3
                        -.1,.8
                        .1, .8
                    `}
                    fill="grey"
                    />
                        (!!soldier.shooting)
                        ? (  
                        
                        <polygon points={`
                                .05,.8
                                -.05,.8
                                -.05,3
                                .05, 3
                            `}
                            fill="yellow"
                            />
                        ) : (null)
                ) : (
                    null
                )
                )
            }
        </g>
    </Role>;
};
roles.enemy = function EnemyRole(props)
{
    const { actor: enemy } = props;
    return <Role {...props}>
        <g fill="orange"
            stroke="red"
            strokeWidth=".2"
        >
            <polygon points={`
                -.5,.3
                .5,.3
                .5,-.3
                -.5,-.3
            `}/>
            //Body
            <polygon points={`
                -.25,-.25
                .25,-.25
                .25,.25
                -.25,.25
            `}
                fill="red"
            />
            //Head
            
             <polygon points={`
                -.5,-.3
                -.45,-.55
                .45,-.55
                .5, -.3
            `}
            fill="black"
            />
            //BackPack
            
            {
                
                (!!enemy.sight)
                ? (
                    <polygon points={`
                        .1,.3
                        -.1,.3
                        -.1,.8
                        .1, .8
                    `}
                    fill="grey"
                    />
                        (!!enemy.shooting)
                        ? (  
                        
                        <polygon points={`
                                .05,.8
                                -.05,.8
                                -.05,3
                                .05, 3
                            `}
                            fill="yellow"
                            />
                        ) : (null)
                ) : (
                    null
                )
                
            }
        </g>
    </Role>;
};

roles.truck = function TruckRole(props)
{
    const { actor: truck } = props;
    return <Role {...props}>
    <polygon points={`
                .3,2
                -.3,2
                -.3,1.6
                .3, 1.6
            `}
            fill="green"
            />
            //Front1
            <polygon points={`
                .3,1.6
                -.3,1.6
                -.3,1.3
                .3, 1.3
            `}
            fill="Aquamarine"
            />
            //Front2
            <polygon points={`
                .3,1.3
                -.3,1.3
                -.3,1.15
                .3, 1.15
            `}
            fill="lime"
            />
            //Front3
            <polygon points={`
                .6,1.3
                -.6,1.3
                -.6,-2
                .6, -2
            `}
            fill="grey"
            />
            //Back
    </Role>;
};

roles.factory = function Factory(props)
{
    const { actor: factory } = props;
    return <Role {...props}>
                <polygon points={`
                3.5,4.5
                3.5,3.5
                -3.5,3.5
                -3.5, 4.5
            `}
            fill="silver"
            />
            <polygon points={`
                3.5,3.5
                3.5,2.5
                -3.5,2.5
                -3.5, 3.5
            `}
            fill="grey"
            />
            <polygon points={`
                3.5,2.5
                3.5,1.5
                -3.5,1.5
                -3.5, 2.5
            `}
            fill="silver"
            />
            <polygon points={`
                3.5,1.5
                3.5,.5
                -3.5,.5
                -3.5, 1.5
            `}
            fill="grey"
            />
            <polygon points={`
                3.5,.5
                3.5,-.5
                -3.5,-.5
                -3.5, .5
            `}
            fill="silver"
            />
            <polygon points={`
                3.5,-.5
                3.5,-1.5
                -3.5,-1.5
                -3.5, -.5
            `}
            fill="grey"
            />
            <polygon points={`
                3.5,-1.5
                3.5,-2.5
                -3.5,-2.5
                -3.5, -1.5
            `}
            fill="silver"
            />
            <polygon points={`
                3.5,-2.5
                3.5,-3.5
                -3.5,-3.5
                -3.5, -2.5
            `}
            
            fill="grey"
            />
            <polygon points={`
                3.5,-3.5
                3.5,-4.5
                -3.5,-4.5
                -3.5, -3.5
            `}
            fill="silver"
            />
    </Role>;
};


roles.barracks = function Barracks(props)
{
    const { actor: barracks } = props;
    return <Role {...props}>
            <polygon points={`
                2.25,3.5
                .75,3.5
                .75,-3.5
                2.25,-3.5
            `}
            fill="maroon"
            />
           <polygon points={`
                .75,3.5
                -1.75,3.5
                -1.75,-3.5
                .75,-3.5
            `}
            fill="brown"
            />
            <polygon points={`
                -1.75,3.5
                -2.25,3.5
                -2.25,-3.5
                -1.75,-3.5
            `}
            fill="maroon"
            />
            
    </Role>;
};

//////////////////////////////////////////////////////////////////////////////
// Main application responsible for setting the stage.
//////////////////////////////////////////////////////////////////////////////

class LD53App extends React.Component
{
    state = {
        //scene: 'intro',
        scene: 'playing',
    };
    
    scenes = {
        intro: IntroScene,
        playing: PlayfieldScene,
    };
    
    render()
    {
        const { children } = this.props;
        const { scene } = this.state;
        const dispatch = (op, ...args) => this['do_' + op](...args)
        const SceneComponent = this.scenes[scene] || ErrorScene;
        
        return <LD53App.Context.Provider value={dispatch}>
            <SceneComponent game={dispatch} scene={scene}/>
        </LD53App.Context.Provider>
    }
    
    do_show = (scene) => { this.setState({ scene: scene }) }
    
    static Context = React.createContext();
}

//////////////////////////////////////////////////////////////////////////////
// Playfield Scene -- SVG + Controls
//////////////////////////////////////////////////////////////////////////////
function PlayfieldScene(props)
{
    return <Playfield
        roles={roles}
    />
}

function Playfield(props)
{
    const { roles } = props;
    const [ clock, setClock ] = React.useState({});
    const [ engine, setEngine ] = React.useState();
    const [ now, setNow ] = React.useState();
    const [ epoch, setEpoch ] = React.useState();
    const [ snapshot, setSnapshot ] = React.useState({});
    const [ selected, setSelected ] = React.useState({});
    
    const context =
    {
        engine: engine,
        selected: selected,
        setSelected: setSelected,
        clearSelected: () => setSelected({}),
        addSelected: (id) => { setSelected({ ...selected, id: true })},
    }
    
    React.useEffect(
        () =>
        {
            setEngine(new LD53Game());
        },
        []
    );
    
    React.useEffect(
        () =>
        {
            if (!!clock)
            {
                clearInterval(clock);
            }
            setEpoch(null);
            setClock(setInterval(() => { setNow(Date.now() / 1000) }, 50));
        }, 
        [engine]
    );
    
    React.useEffect(
        () =>
        {
            if (!epoch)
            {
                setEpoch(now);
            }
            else
            {
                const dt = (now - epoch);
                setSnapshot(engine.tick(dt, snapshot));
            }
        },
        [now]
    );
    
    function clearSelected(event)
    {
        console.log("CLEAR");
        event.preventDefault();
        event.stopPropagation();
        if (!event.shiftKey)
        {
            setSelected({});
        }            
    }
    
    return <Playfield.Context.Provider value={context}>
        <div className="playfield-scene">
            <svg viewBox="-11 -11 23 23" strokeWidth='1px' stroke='black' fill='none'>
                <rect x="-11" y="-11" width="23" height="23"
                    stroke="none"
                    pointerEvents='bounding-box'
                    onClick={clearSelected}
                    />
                <g transform="scale(1, -1)">
                {
                    Object.entries(snapshot).map(([id, actor]) => 
                    {
                        const Role = roles[actor.role];
                        return <Role 
                            now={now}
                            id={id} 
                            key={id} 
                            actor={actor} 
                            {...actor}
                        />;
                    })
                }
                </g>
            </svg>
            <ControlPanel snapshot={snapshot} selected={selected}/>
        </div>
    </Playfield.Context.Provider>;        
}

Playfield.Context = React.createContext();

function ControlPanel(props)
{
    const { selected } = props;
    
    return <div className='player-controls'>
        <RB.Container fluid>
        {
            Object.keys(selected).length
            ? <OrdersPanel {...props}/>
            : <BlankPanel {...props}/>
        }
        </RB.Container>
    </div>;
}

const subpanels = {};
function OrdersPanel(props)
{
    const { snapshot, selected } = props;
    
    const buckets = {};
    for (const [id, isSelected] of Object.entries(selected))
    {
        if (!isSelected)
        {
            return;
        }
        const actor = snapshot[id];
        var bucket = buckets[actor.role];
        if (!bucket)
        {
            bucket = buckets[actor.role] = {};
        }
        bucket[id] = actor;
    }
    
    return <RB.Row>
        {
            Object.entries(buckets).map(
                ([role, group]) =>
                {
                    const Subpanel = subpanels[role];
                    const count = Object.keys(group).length;
                    var label;
                    if (Subpanel == null)
                    {
                        label = count == 1 ? "item" : "items";
                        return <h1 key={role}>{ count } {label}</h1>;
                    }
                    else
                    {
                        label = count == 1 
                                ? Subpanel.singular || "item"
                                : Subpanel.plural || "items";
                        return <RB.Col key={role}>
                            <h1>{ count } {label}</h1>
                            <Subpanel role={role} group={group}/>
                        </RB.Col>;
                    }
                }
            )
        }
    </RB.Row>
}

subpanels.soldier = function SoldersSubpanel(props)
{
    return <RB.Row xs={3}>
        <RB.Button className='col'>
            <i className='bi bi-arrows-move'/>
            Move
        </RB.Button>
    </RB.Row>;
}
subpanels.soldier.singular = 'Soldier';
subpanels.soldier.plural = 'Soldiers';

function GenericSubpanel(props)
{
    const { role, group } = props;
    return <h1>{ Object.keys(group).length } Items ({role})</h1>
}

function BlankPanel(props)
{
    return <div>
        <h1>...</h1>
    </div>
}

//////////////////////////////////////////////////////////////////////////////
// Misc. Scenes
//////////////////////////////////////////////////////////////////////////////
function IntroScene(props)
{
    const { game } = props;
    
    return <div>
        <h1>Game</h1>
        <button onClick={() => game('show', 'playing')}>Start</button>
    </div>;
}

function ErrorScene(props)
{
    const { game, scene } = props;
    return <div>
        <h1>Error</h1>
        <div>Scene {scene} not valid.</div>
    </div>
}

//////////////////////////////////////////////////////////////////////////////
// Kick start the app in the #app element.
//////////////////////////////////////////////////////////////////////////////

const app = <LD53App/>;
ReactDOM.createRoot(document.getElementById('app')).render(app);
