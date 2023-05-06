
const modules = {
    react: React
};

function require(name)
{
    const module = modules[name];
    if (!module)
    {
        throw `Invalid module: '${name}'`; 
    }
    return module;
}