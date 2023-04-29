/* global React */
/* global ReactDOM */
/* global ReactBootstrap */
const RB = ReactBootstrap;
import LD53Game from "./engine.js";

//////////////////////////////////////////////////////////////////////////////
// Actor roles -- add/change these to make display updates.
//////////////////////////////////////////////////////////////////////////////

const roles = {};

function Role(props)
{
    const { x=0, y=0 } = props;
    
    return <g transform={`translate(${x},${y})`}>
        {props.children}
    </g>;
}

roles.generic = function GenericRole(props)
{
    return <Role {...props}><circle r={0.5}/></Role>;
}

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
    const [ engine, setEngine ] = React.useState(new LD53Game());
    const [ now, setNow ] = React.useState();
    const [ epoch, setEpoch ] = React.useState();
    const [ snapshot, setSnapshot ] = React.useState({});
    
    React.useEffect(
        () =>
        {
            if (!!clock)
            {
                clearInterval(clock);
            }
            setEpoch(null);
            setClock(setInterval(() => { setNow(Date.now() / 1000) }), 100);
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
    
    return <div className="playfield-scene">
        <svg viewBox="-11 -11 23 23" strokeWidth='1px' stroke='black' fill='none'>
            {
                Object.values(snapshot).map((actor, id) => 
                {
                    const Role = roles[actor.role];
                    return <Role key={id} {...actor}/>;
                })
            }
        </svg>
        <div className='player-controls'>
            <h1>Controls</h1>
        </div>
    </div>;
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
