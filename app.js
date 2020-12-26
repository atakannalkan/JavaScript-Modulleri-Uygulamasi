/*Burada uygulamamı 3' böldüm ProductControl: Ürün bilgilerini APPControl'e gönderdim,
 UIControl: Genel olarak görsel işlemler HTML'ye veri ekleme veri silme gibi,
 APPControl: ProductControl'den gelen bilgileri UIControl'e göndererek işleme soktum,bilgileri parametre olarak gönderdim
 -Yani kısacası ProductControl'de bilgileri ekledim çıkardım parametresinde bilgi olmadığı için kontrol ettirdim kontrol sonucunda
 UIControl'e göndererek bilgileri HTML ile görsele çevirdim.*/

//Product Controller

const StorageController = (function(){

    return{
        storeProduct: function(product){
            let products;

            if(localStorage.getItem("products")===null){
                products = [];
                products.push(product);
            }
            else{
                products = JSON.parse(localStorage.getItem("products"));
                products.push(product);//Push metodu ile ekliyorum.
            }
            localStorage.setItem("products",JSON.stringify(products));//Json yapmamın sebebi kodların object olması yani html td olarak görebileceğiz.
        },
        getProducts: function(){
            let products;

            if(localStorage.getItem("products")===null){
                products = [];
            }
            else{
                products = JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },
        updateProduct: function(product){
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach(function(prd,index){
                if(product.id == prd.id){
                    products.splice(index,1,product);//verilen indexten itibaren 1 eleman siler ve onun yerine product ekler.
                }
            });

            localStorage.setItem("products",JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach(function(prd,index){
                if(id == prd.id){
                    products.splice(index,1);//verilen indexten itibaren 1 eleman siler ve onun yerine product ekler.
                }
            });

            localStorage.setItem("products",JSON.stringify(products));
        }
    }
 })();


const ProductControl = (function () {
    //Private
    const Product = function (id, name, marka, fiyat) {
        this.id = id;
        this.name = name;
        this.marka = marka;
        this.fiyat = fiyat;
    }

    const data = {
        products: //StorageController.getProducts(), İstersen localstorageyi aktif edersin ama hata aldığım için kapattım.
        [/*
            {id: 1,name: "Monitör",marka: "Samsung",fiyat: 300},
            {id: 2,name: "İşlemci",marka: "AMD Ryzen",fiyat: 500},
            {id: 3,name: "Ram",marka: "Corsair",fiyat: 150},
            {id: 4,name: "Anakart",marka: "MSİ Gaming",fiyat: 200},
            {id: 5,name: "Ekran Kartı",marka: "Nvdia 3080 Tİ",fiyat: 100},*/
        ],
        selectProduct: null,//Kullanıcının seçmiş olduğu ürünü buraya aktardım.
        totalfiyat: 0//Fiyatı ilk başta o'a eşitledim.
    }
    //Public
    return {
        getProducts: function () {//Datanın içindeki products'ları anasayfaya return ettim.
            return data.products;
        },
        getData: function () {//Datayı anasayfaya return ettim.
            return data;
        },
        addProduct: function (name, marka, fiyat) {//Burada üstteki product'dan aldığım boş değerleri doldurarak tekrardan product'a gönderiyorum.
            let id;
            if (data.products.length > 0) {
                id = data.products[data.products.length - 1].id + 1;//Burada + - işlemleri kullanmassak undefined hatası aldığımız için bende 1 azaltıp 1 arttırarak çözümü buldum.
            } else {
                id = 0;
            }

            const newProduct = new Product(id, name, marka, parseFloat(fiyat));//Product değişkeninin bilgilerini ilgili değişkene aktarıyorum.
            data.products.push(newProduct);//datanın içindeki products'a push yani ekle metodu ile newproduct'daki bilgileri aktarıyorum.
            return newProduct;//Newproduct'ı return ederek anasayfaya gönderdim.
        },
        getTotal: function () {
            let total = 0;//totala sıfır sayısını verdim
            data.products.forEach(item => {//foreach ile data.products içindeki bütün fiyatları topladım
                total += item.fiyat;
            });
            data.totalfiyat = total;//totaldaki bilgiyi datadaki totalfiyat'a aktardım.
            return data.totalfiyat;//Bu değişkeni ileride kullanacağım için anasayfaya return ettim.
        },
        getProductByİd: function (id) {
            let product = null;

            data.products.forEach(function (prd) {
                if (prd.id == id) {//Burada kontrol yaptım parametreye gelen id ile o parametredeki id aynıysa işlemi yap.
                    product = prd;//bilgileri product değişkenime atıyorum.
                }
            })

            return product;//product'u anasayfada kullanacağım için return ettim.
        },
        setCurrentProduct: function (product) {
            data.selectProduct = product;//Parametredeki değeri data.selectProduct'a aktardım.
        },
        getCurrentProduct: function () {
            return data.selectProduct;//ve data.selectproduct'ı ana dizinde kullanacağım için return ettim.
        },
        updateProduct: function (name, fiyat, marka) {//parametre bilgilerini aldım.
            let product = null;

            data.products.forEach(function (prd) {//data products'un içindeki tüm elemanları dolaştım.

                if (prd.id == data.selectProduct.id) {//eğer bana gelen id ve parametredeki id aynıysa işlemi yap.
                    prd.name = name;//Yukarıdan aldığım parametre bilgilerini prd'deki nameye atadım
                    prd.fiyat = parseFloat(fiyat);//Benim almak istediğim sayı olduğu için float içine aldım
                    prd.marka = marka;

                    product = prd;//Bütün bilgileri product değişkenine attım
                }
            });
            return product;//product'ı anasayfada kullanacağım için return ettim.
        },
        deleteProduct: function (product) {
            data.products.forEach(function (prd, index) {
                if (prd.id == product.id) {//eğer bana gelen id ve parametredeki id aynıysa işlemi yap.
                    data.products.splice(index, 1);/*hatırlarsan splice metodu 2 parametre alır 1-akçıncı sıradaki silinecek 2- kaç tane silinecek
                    bende indexden gelen sayıdaki silinecek ve 1 tane silinecek dedim*/
                }
            })
        }
    }
})();


//UI Controller
const UIControl = (function () {/*Önemli olan nokta normal fonksiyon değil tek kullanımlık fonksiyon kullanarak return ettiğim fonksiyonları teker teker
     appcontrol'ün içine çekebildim, eğer normal bir fonksiyon olsa içindeki fonksiyonları appcontrol'un içine çekemezdim*/

    const Selectors = {//Burada HTML'deki butonlarımı teker teker çağıracağımı değişken tanımlayıp değişkenlerin içine attım ve nutonları buradan çağırdım.
        productList: "#item-list",
        addButton: ".addbtn",
        savebtn: ".savebtn",
        deletebtn: ".deletebtn",
        closebtn: ".closebtn",

        productName: "#name",
        productFiyat: "#fiyat",
        productMarka: "#marka",
        totalTl: "#tl",
        totalDolar: "#dolar",
        productListItems: "#item-list tr"
    }

    return {
        CreateProducts: function (products) {/*Burada products parametresindeki id,name gibi bilgileri html'ye döküyoruz
         parametreyi ise data.products'dan alıyoruz yani products'ın içindeki bilgileri html'ye dönüştürüyoruz.*/
            let html = ``;

            products.forEach(prd => {//Foreach oluşturmamın sebebi bütün değişkenleri yazmak.
                html += `
                <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td> Marka: <strong>${prd.marka}</strong></td>
                        <td>${prd.fiyat} $</td>
                        <td class="text-right">
                            <button type="submit" class="btn btn-warning btn-sm">
                            <i class="far fa-edit"></i> Düzenle
                        </button>
                    </td>
                    </tr>
                `;
            });

            document.querySelector("#item-list").innerHTML = html;//İtemlist'in html'sine html değişkeninin bilgilerini aktarıyoruz.
        },

        getSelectors: function () {//Selectors'u ana dizinde kullanacağım için return ediyorum.
            return Selectors;
        },
        addProduct: function (prd) {//Yukarıda data bilgilerini html'ye aktardık burada ise html'deki bilgileri dataya aktaracağız.
            var item = `
            <tr>
                        <td>${prd.id}</td>
                        <td>${prd.name}</td>
                        <td> Marka: <strong>${prd.marka}</strong></td>
                        <td>${prd.fiyat} $</td>
                        <td class="text-right">
                            <button type="submit" class="btn btn-warning btn-sm mybtn">
                            <i class="far fa-edit"></i> Düzenle
                        </button>
                    </td>
                    </tr>
            `;
            document.querySelector(Selectors.productList).innerHTML += item;//Selectors'daki productlist yani html listemin içeriğine inputtan aldığım valueleri ekledim.
        },
        clearİnput: function () {//Bu fonksiyonu yeri geldiğinde çağırarak inputlarımı temizledim.
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productFiyat).value = "";
            document.querySelector(Selectors.productMarka).value = "";
        },
        writeTotal: function (deger) {
            document.querySelector(Selectors.totalDolar).innerHTML = deger;//Selcetors'daki totaldoların html'sine deger'i ekledim
            let tl = parseFloat(deger * 8);//sonucu 7 ile çarparak doları tl'ye çevirdim.
            console.log(tl);
            document.querySelector(Selectors.totalTl).innerHTML = tl + " (Dolar: 8 TL)";//Selectors'daki totaltlnin html'sine tl değerini aktardım.
        },
        addProductForm: function () {
            const selectProduct = ProductControl.getCurrentProduct();//getcurrentproduct'ı ilgili değişkenime aktardım.
            document.querySelector(Selectors.productName).value = selectProduct.name;//Selectpors.productname'nin valuesine ilgili değişkeni aktarıyorum.
            document.querySelector(Selectors.productFiyat).value = selectProduct.fiyat;
            document.querySelector(Selectors.productMarka).value = selectProduct.marka;
        },
        addStage: function (item) {//Burada eklendikten sonra üstteki 3 butonumu kaldırmak için gerekli işlemleri yaptım.
            UIControl.clearWarnings();//arka plan rengi warning olanı metodu çağırarak sildim.
            UIControl.clearİnput();//İnputlarımın içini ilgili metodu çağırarak sildim.
            document.querySelector(Selectors.addButton).style.display = "inline";//sadece ekle butonumu görünür diğerlerini görünmez yaptım.
            document.querySelector(Selectors.savebtn).style.display = "none";
            document.querySelector(Selectors.deletebtn).style.display = "none";
            document.querySelector(Selectors.closebtn).style.display = "none";
        },
        editStage: function (tr) {
            tr.classList.add("bg-warning");
            document.querySelector(Selectors.addButton).style.display = "none";
            document.querySelector(Selectors.savebtn).style.display = "inline";
            document.querySelector(Selectors.deletebtn).style.display = "inline";
            document.querySelector(Selectors.closebtn).style.display = "inline";
        },
        updateProductEdit: function (prd) {//Bilgileri gelen parametreye göre güncelliyorum.
            let updateItem = null;
            let items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function (item) {
                if (item.classList.contains("bg-warning")) {
                    item.children[1].innerHTML = prd.name;
                    item.children[2].innerHTML = `Marka: <strong>${prd.marka}</strong>`;
                    item.children[3].innerHTML = prd.fiyat + " $";

                    updateItem = item;
                }
            });

            return updateItem;
        },
        clearWarnings: function(){//Burada arka plan rengi warning olanların classlarını sildim.
            const items = document.querySelectorAll(Selectors.productListItems);

            items.forEach(function(item){
                if(item.classList.contains("bg-warning")){
                    item.classList.remove("bg-warning");
                }
            });
        },
        deleteProduct: function(){
            let items = document.querySelectorAll(Selectors.productListItems);//item-list'in içindeki tüm tr'leri items değişkenine aktardım.
            items.forEach(function(item){//Bütün trlerin içine girdim ve eğer ilgili class varsa sildim.
                if(item.classList.contains("bg-warning")){//contains ile ilgili class varmı kontrol ettim.
                    item.remove();//var ise sildim
                }
            })
        }
    }
})();


//App Controller
const APPControl = (function (Productctrl, UIctrl,Storagectrl) {//Burada parametre isimlerini yazdım gerçek paramtreyi fonksiyonun en altında verdim.

    const uiSelectors = UIControl.getSelectors();//parametre ile selectorları getirdim.
    //Load event listener
    const loadevent = function (e) {
        // add product event
        document.querySelector(".addbtn").addEventListener("click", productSubmit);

        // edit product click
        document.querySelector(uiSelectors.productList).addEventListener("click", productEditClick);

        // edit product submit
        document.querySelector(uiSelectors.savebtn).addEventListener("click", editProductSubmit);

        //cancel button
        document.querySelector(uiSelectors.closebtn).addEventListener("click",cancalUpdate);

        //Delete Button
        document.querySelector(uiSelectors.deletebtn).addEventListener("click",deleteProductSubmit);
    }

    const productSubmit = function (e) {

        const productname = document.querySelector(uiSelectors.productName).value;//3 inputtan value bilgisi aldım ve ilgili değişkenlerime attım.
        const productFiyat = document.querySelector(uiSelectors.productFiyat).value;
        const productMarka = document.querySelector(uiSelectors.productMarka).value;

        console.log(productname, productMarka, productFiyat);
        if (productname !== "" && productFiyat !== "" && productMarka !== "") {//inputlarım boş değilse işlem yap
            //add product
            const newProduct = Productctrl.addProduct(productname, productMarka, productFiyat);

            //add item to list
            UIctrl.addProduct(newProduct);

            //Clear İnputs
            UIctrl.clearİnput();

            //Write Total
            const total = Productctrl.getTotal();
            UIctrl.writeTotal(total);
            Storagectrl.storeProduct(newProduct);
        }
        e.preventDefault();
    }

    const productEditClick = function (e) {
        if (e.target.classList.contains("mybtn")) {
            //id'de paretn element elemanın bir üst ailesine çıkar elementsibling ise tr içinde 4 eleman varsa ondan bir önceki elemana gelir.
            const id = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
            const product = Productctrl.getProductByİd(id);//Yukarıda id'numarasına geldik burada ise id'yi metoda parametre olarak gönderiyorum.
            Productctrl.setCurrentProduct(product);//ilgili metodun parametresine yukarıdaki product değişkenine veriyorum.

            UIctrl.addProductForm();//Metodu çağırdım

            UIctrl.editStage(e.target.parentElement.parentElement);//editstageye parametre gönderdim.
        }
        e.preventDefault();
    }

    const editProductSubmit = function (e) {
        const productName = document.querySelector(uiSelectors.productName).value;//Burada inputlarımın valuesini aldım.
        const productFiyat = document.querySelector(uiSelectors.productFiyat).value;
        const productMarka = document.querySelector(uiSelectors.productMarka).value

        if (productName != "" && productFiyat != "" && productMarka != "") {//inputlarım boş değilse işlemi yap

            const bilgi = Productctrl.updateProduct(productName, productFiyat, productMarka);//updateproducta bilgileri gönderdim ve değişkenime attım.
            let item = UIctrl.updateProductEdit(bilgi);//yukarıdaki inputlardaki bilgiyi parametre olarak gönderdim ve bilgilerimi güncelledim.

            //Clear İnputs
            UIctrl.clearİnput();//inputlarımı metodu çağırarak sildim

            const total = Productctrl.getTotal();//totaldaki bilgileri değişkenime attım.
            UIctrl.writeTotal(total);//değişkendeki bilgileri write toala yazdırması için attım.

            UIctrl.addStage(item);//add stageye item bilgilerini gönderdim.

            //Update Storage
            //Storagectrl.updateProduct(bilgi);

        }

        e.preventDefault();
    }

    const cancalUpdate = function(e){
        UIctrl.addStage();//addstage ile butonlarımın görünürlüğünü kapattım
        e.preventDefault();
    }

    const deleteProductSubmit = function(e){
        const selectProduct = Productctrl.getCurrentProduct();

        //delete product
        Productctrl.deleteProduct(selectProduct);

        //Delete UI
        UIctrl.deleteProduct(selectProduct);

        //Write Total
        const total = Productctrl.getTotal();
        UIctrl.writeTotal(total);

        UIControl.addStage();//addstage ile diğer butonların görünürlüğünü kapattım.

        //Delete Storage
        StorageController.deleteProduct(selectProduct.id);
        e.preventDefault();
    }

    return {//metodum çalıştığı anda return içindeki bilgiler çalışacaktır.
        init: function () {
            console.log("Uygulama başlatıldı");

            console.log(Productctrl.getProducts());

            UIctrl.CreateProducts(Productctrl.getProducts());

            loadevent();

            UIctrl.addStage();
        }
    }

})(ProductControl, UIControl,StorageController);//Hatırlıyorsan, bu tür fonksiyonda parametre buraya verilir.

APPControl.init();//programım açıldığı anda appcontrol içindeki init fonksiyonuda başlasın.