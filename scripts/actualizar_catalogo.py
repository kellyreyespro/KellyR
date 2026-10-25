"""ALÉA: sincronización conservadora de ofertas públicas por ficha de producto.
Solo muestra una oferta si la tienda declara precio Y disponibilidad InStock
mediante datos estructurados. Respeta robots.txt y no inventa datos.
"""
import json, datetime, re, time
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser
from pathlib import Path

USER_AGENT="ALEA-Wellness-Catalog/0.2 (+https://github.com/kellyreyespro/KellyR)"
SOURCES=[
 {"product_id":"kotex36","url":"https://www.superxtra.com/protectores-diarios-femeninos-kotex-36-und-multiestilo-regulares/p"},
 {"product_id":"listerine","url":"https://www.superxtra.com/listerine-total-care-12x500-ml-7702035833839/p"}
]
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.in_json=False;self.scripts=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=="script" and d.get("type","").lower()=="application/ld+json":self.in_json=True
 def handle_endtag(self,tag):
  if tag=="script":self.in_json=False
 def handle_data(self,data):
  if self.in_json:self.scripts.append(data)
def fetch(url):
 u=urlparse(url);robots=u.scheme+"://"+u.netloc+"/robots.txt"
 rp=RobotFileParser()
 try:
  rp.set_url(robots);rp.read()
  if not rp.can_fetch(USER_AGENT,url):return None
 except Exception:return None
 with urlopen(Request(url,headers={"User-Agent":USER_AGENT,"Accept":"text/html"}),timeout=12) as r:
  if r.status!=200 or int(r.headers.get("Content-Length","0"))>1_000_000:return None
  return r.read(1_000_000).decode("utf-8","replace")
def walk(obj):
 if isinstance(obj,list):
  for item in obj:yield from walk(item)
 elif isinstance(obj,dict):
  yield obj
  for k,v in obj.items():
   if k in ("@graph","hasVariant","offers","mainEntity","itemListElement"):yield from walk(v)
def get_offer(raw):
 h=Page();h.feed(raw)
 for snippet in h.scripts:
  try:root=json.loads(snippet)
  except (ValueError,TypeError):continue
  for thing in walk(root):
   availability=str(thing.get("availability","")).lower()
   if "instock" not in availability or "outofstock" in availability:continue
   value=thing.get("price");currency=thing.get("priceCurrency","USD")
   if not value and isinstance(thing.get("priceSpecification"),dict):value=thing["priceSpecification"].get("price")
   try:
    price=float(str(value).replace(",","").replace("$",""))
    if not 0<price<10000:continue
   except (TypeError,ValueError):continue
   return {"price":round(price,2),"currency":str(currency)[:3],"available":True}
 return None
def main():
 now=datetime.datetime.now(datetime.timezone.utc).isoformat()
 out=[]
 for entry in SOURCES:
  try:
   html=fetch(entry["url"])
   result=get_offer(html) if html else None
   if result:out.append({**result,"product_id":entry["product_id"],"checked_at":now,"source_url":entry["url"]})
  except Exception as exc:print(entry["product_id"],type(exc).__name__)
  time.sleep(2)
 path=Path("data/ofertas.json");path.parent.mkdir(exist_ok=True);path.write_text(json.dumps(out,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print("Ofertas verificadas:",len(out),"de",len(SOURCES))
if __name__=="__main__":main()
