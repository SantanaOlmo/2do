/*Poción peligrosa:
Un input (nivelMagia, entero) y un desplegable capa con valores invisible, roja, negra. Y un botón de "evaluar amenaza".
Si nivelMagia > 70 mostrar un mensaje "¡Cuidado, magia poderosa!", si es menor "Magia inofensiva".
Decisión múltiple:
Dependiendo del valor seleccionado en capa (usando switch):
"invisible" → "Puedes espiar sin ser visto"
"roja" → "Todos te miran"
"negra" → "Sospechoso"
Entrega: El html con el script incluido.*/

message=document.getElementById("message");

    function evaluateMagic(){
        nivelMagia = document.getElementById("nivelMagia").value ;
        if (nivelMagia>70){
            message.textContent= "¡Cuidado, magia poderosa!";
        }else{
            message.textContent= "Magia inofensiva";
        }
    }
    function showPower(){
        magicMessage=document.getElementById("message");
        typeMagic= document.getElementById("typeMagic").value;

        switch (typeMagic){
            case "invisible":
                message.textContent= "Puedes espiar sin ser visto";
            break;
            case "roja":
                message.textContent= "Todos te miran";
            break;
            case "negra":
                message.textContent= "Sospechoso"
            break;
            default:
                message.textContent= "";
                break;

        }
    }

    