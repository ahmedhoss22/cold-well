import Cookies from 'universal-cookie';
const cookies = new Cookies();
class CookiesService{
get(name){
    return cookies.get(name)
}
set(name,value,options){
    return cookies.set(name,value,options)
}
remove(name){
    return cookies.remove(name)
}
}

export default new CookiesService()