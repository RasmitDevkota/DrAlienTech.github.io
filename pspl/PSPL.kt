var vocab = Array<String>(27,"insert","remove","getprops","editprops","coords","to",
    "radius","lever","wheelaxle","pulley","inclinedplane",
    "wedge","screw","link","object","pole","motors","generators",
    "electromagnetic","particle","angle","name","input","width",
    "height","length","charge","add")
var fwords = Array<String>(5,"insert","remove","getprops","editprops","coords","to")

fun main(args: Array<String>){
    code = readLine()!!.split(' ')
    fun reader(args: Array<String>){
        for ((index, value) in code.withIndex()) {
            if(value in vocab){
                println("foo")
                if(index == 0){
                    if(value in fwords){
                        println("bar")
                    } else{
                        println("First word not valid.")
                    }
                }
            } else{
                println("Word "+value+" not found!")
            }
        }
    }
}
