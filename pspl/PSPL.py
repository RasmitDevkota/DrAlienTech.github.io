import numpy as np
import matplotlib.pyplot as plt
################################################
class Vocabulary:

  def __init__(self, vocab):
    self.vocab = vocab
    return

  vocab = np.array([["insert","remove","getprops","editprops","coords","to"],
                             ["radius","lever","wheelaxle","pulley","inclinedplane",
                              "wedge","screw","link","object","pole","motors","generators",
                              "electromagnetic","particle"],["angle","name","input","width",
                              "height","length","charge","add"]])
################################################
def insert(code):
  obj = code[1]
  name = code[2]
  x = code[3]
  y = code[4]
  simple_machines.smlist[obj+name] = [obj,name,x,y]
  return

def remove(code):
  obj = code[1]
  name = code[2]
  keyw = (obj+name)
  print("keyword ",keyw)
  for key,values in simple_machines.smlist.items():
    if(key == keyw):
      print("values ",values)
      del simple_machines.smlist[keyw]
      print(obj,name," removed")
      print("smlist ",simple_machines.smlist)
      break
  return

def link(code):
  obj1 = code[1]
  name1 = code[2]
  o1input = code[3]
  obj2 = code[4]
  name2 = code[5]
  o2input = code[6]
  input_type = code[7]
  return

def getprops(code):
  obj = code[1]
  name = code[2]
  return

def editprops(code):
  obj = code[1]
  name = code[2]
  return

def to(code):
  assert code[3]=="add","Invalid Syntax"
  obj1 = code[1]
  name = code[2]
  obj2 = code[4]
  return

def coords(code,get=False,change=False):
  syntax = np.array([x,y,xnew,ynew])
  if(get==change):
    print("Can't get and change at the same time, set one to false, or just remove it from the code!")
  elif(get == False and change == False):
    print("Set 'get' or 'change' to true. Like this: get=True, or, change=True")
  obj = code[1]
  name = code[2]
  objn = obj+name
  return
################################################
########## Super Classes
class simple_machines:
  def __init__(self):
    return
simple_machines.smlist = {}
simple_machines.smtemp = {}
########## End of Super Classes
def lever():
  levers = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('lever'+name)):
      print("key ",key)
      print("values ",values)
      levers[key] = values
  print("levers ",levers)
  return

def pulley():
  pulleys = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('pulley'+name)):
      print("key ",key)
      print("values ",values)
      pulleys[key] = values
  print("pulleys ",pulleys)
  return

def wheelaxle():
  wheelaxles = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('wheelaxle'+name)):
      print("key ",key)
      print("values ",values)
      wheelaxles[key] = values
  print("wheelaxles ",wheelaxles)
  return

def inclinedplane():
  inclinedplanes = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('inclinedplane'+name)):
      print("key ",key)
      print("values ",values)
      inclinedplanes[key] = values
  print("inclinedplanes ",inclinedplanes)
  return

def wedge():
  wedges = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('wedge'+name)):
      print("key ",key)
      print("values ",values)
      wedges[key] = values
  print("wedges ",wedges)
  return

def screw():
  screws = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('screw'+name)):
      print("key ",key)
      print("values ",values)
      screws[key] = values
  print("screws ",screws)
  return

def marble():
  marbles = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('marble'+name)):
      print("key ",key)
      print("values ",values)
      marbles[key] = values
  print("marbles ",marbles)
  return

def block():
  blocks = {}
  for key,values in simple_machines.smlist.items():
    name = values[1]
    if(key == ('block'+name)):
      print("key ",key)
      print("values ",values)
      blocks[key] = values
  print("blocks ",blocks)
  return
################################################
def parser(code):
  parser.code_array = np.array(code.split())
  for word in parser.code_array:
    if(word in Vocabulary.vocab or word in range(1,301)):
      return
    else:
      print(" Word: ", word, " is not found.")
  return
################################################
def reader(code_array):
  if(parser.code_array[0] in Vocabulary.vocab[0]):
    fword = parser.code_array[0]
    if(fword == "insert"):
      insert(parser.code_array)
    elif(fword == "remove"):
      remove(parser.code_array)
    elif(fword == "getprops"):
      getprops(parser.code_array)
    elif(fword == "editprops"):
      editprops(parser.code_array)
    elif(fword == "coords"):
      coords(parser.code_array)
    elif(fword == "to"):
      to(parser.code_array)

  else:
    print("First word not found")
  return
################################################
def visuals():
  img = plt.imread("background.png")
  fig, ax = plt.subplots()
  xr = range(500)
  ax.imshow(img, extent=[0,500, 0,500])
  return
