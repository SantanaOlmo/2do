print("Hola")
nombre = "Alberto"
edad = 25

def saludo (persona, años):
    return f"hola {persona}, tienes {años} años."+ "hola"

for i in range (3):
    print(saludo(nombre,edad+i))


mi_lista = [1,"hola0",True]
print(mi_lista)
print(mi_lista[-1])
print(mi_lista[:2])
mi_lista.append(64) #añado el 64 al final
mi_lista.insert(3,0) #añado el 0 en la posicion 3
print(mi_lista)
mi_lista.remove("hola0")
print(f"Mi lista despues de borrar el hola0: {mi_lista}")