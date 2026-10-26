"""The catalog must never treat unrelated structured data as a purchasable offer."""
import importlib.util
import json
import pathlib
import unittest
spec=importlib.util.spec_from_file_location('catalogo',pathlib.Path(__file__).parents[1]/'scripts/actualizar_catalogo.py')
catalogo=importlib.util.module_from_spec(spec)
spec.loader.exec_module(catalogo)

def page(data):
    return '<script type="application/ld+json">'+json.dumps(data)+'</script>'

class CatalogTests(unittest.TestCase):
    def product(self, **offer):
        return {'@type':'Product','image':['/product.jpg'],'offers':{'@type':'Offer','availability':'https://schema.org/InStock','price':'12.50','priceCurrency':'USD',**offer}}
    def test_exact_stock_price_and_product_image(self):
        self.assertEqual(catalogo.get_offer(page(self.product()),'https://shop.example/item'),{'price':12.5,'currency':'USD','available':True,'image_url':'https://shop.example/product.jpg'})
    def test_unavailable_and_unknown_prices_are_not_offers(self):
        for fields in [{'availability':'https://schema.org/OutOfStock'},{'availability':'NotInStock'},{'price':'NaN'},{'price':-1},{'priceCurrency':''}]:
            with self.subTest(fields=fields):self.assertIsNone(catalogo.get_offer(page(self.product(**fields))))
    def test_unrelated_schema_is_not_a_product(self):
        self.assertIsNone(catalogo.get_offer(page({'@type':'Event','offers':self.product()['offers']})))
    def test_other_product_on_same_page_cannot_supply_price(self):
        other=self.product();other['url']='https://shop.example/other'
        self.assertIsNone(catalogo.get_offer(page(other),'https://shop.example/item'))
        other['url']='https://shop.example/item#product'
        self.assertIsNotNone(catalogo.get_offer(page(other),'https://shop.example/item'))
    def test_graph_product_and_invalid_json(self):
        self.assertIsNotNone(catalogo.get_offer(page({'@graph':[self.product()]})))
        self.assertIsNone(catalogo.get_offer('<script type="application/ld+json">invalid</script>'))

if __name__=='__main__':unittest.main()
