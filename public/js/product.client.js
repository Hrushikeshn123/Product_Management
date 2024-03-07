window.addEventListener("load",()=>{
    let list = []
    let tbody = document.querySelector('#id-tbody')
    let saveNewProductBtn = document.querySelector('#saveNewProductBtn')
    
    let imageFileElement = document.getElementById('pic')
    document.getElementById('pic').addEventListener('change',()=>{
       // console.log(imageFileElement.files[0])
        if(imageFileElement.files[0] !== undefined){

            let ext = imageFileElement.files[0].name.substring(imageFileElement.files[0].name.lastIndexOf('.')+1)
            ext = ext.toLowerCase()
            if(ext === 'png' || ext === 'jpg' || ext === 'jpeg'){

            let reader = new FileReader() //it special class it get automatically trigger when we read image
            reader.onload = ()=>{
                document.querySelector("#preview").src = reader.result
            }
            reader.readAsDataURL(imageFileElement.files[0])
            }else{
               alert('file must of different ytpe')
               imageFileElement.value = ""  //check it later by value("")
               document.querySelector("#preview").src = "/demopic/preview.png" 
            }
        }else{
            document.querySelector("#preview").src = "/demopic/preview.png" 
        }
    })

    saveNewProductBtn.addEventListener('click', async ()=>{
        // let newProduct = {
        //    productName: document.querySelector('#productName').value,
        //    qty: document.querySelector('#qty').value,
        //    price: document.querySelector('#price').value,
        //    mangDate: document.querySelector('#mangDate').value,
        //    id: id,
        // }
        let productFile = document.querySelector('#pic')
        let file = productFile.files[0]
        if(file === undefined){
            alert("please select a file")
            return false
        }

        // formdata
        let formData = new FormData()

        formData.append('productName',document.querySelector("#productName").value)
        formData.append('qty',document.querySelector("#qty").value)
        formData.append('price',document.querySelector("#price").value)
        formData.append('mangDate',document.querySelector("#mangDate").value)
        formData.append('id',id)
        formData.append('pic',file)
        
    

        let url = `http://localhost:8000/save-new-product`
        let option = {
            method:'POST',
            headers:{
               // "Content-Type": "application/json",
                //'Content-Type': 'application/x-www=form=urlencoded'
                //"Content-Type": "multipart/form-data"
            },
            // body: JSON.stringify(newProduct)
            body: formData
        }
        try{
       let response =  await fetch(url,option)
       let data = await response.json()
            if(data.status === true)
            {
            let isToAddNew = confirm(
                data.message + ', do you want to add new product?')
                if(isToAddNew){
                            document.querySelector('#productName').value = ""
                            document.querySelector('#qty').value = ""
                            document.querySelector('#price').value = ""
                            document.querySelector('#mangDate').value = ""
                            document.querySelector('#pic').value = ""
                            
                }else{
                    window.location.reload()
                }
            }else{
            alert(data.message)
            }
            getProductDetails()
        }catch(error){
            console.log(error)
        }
    })
   async function getProductDetails(){
    try{
        let url = `http://localhost:8000/get-product`
        let response = await fetch(url,{method: "GET"})
        let data = await response.json()
        if(data.status === true)
        {
             list = data.result
           printData(list)
        }else{
        alert(data.message)
        window.location.reload()
        }
    }catch(error){
        alert(data.message)
        window.location.assign('/login')
    }
             
    
   }
   
    function printData(list){
        tbody.innerHTML=list.map((product, index)=>{
        
            return `<tr>
                <th scope="row">${index+1}</th>
                <td>
                <img src="/images/${product.image}" width="50" />
                ${product.productName}</td>
                <td>Rs. ${product.price}</td>
                <td>${product.qty} units</td>
                <td><button data-remove-id="${product._id}" class="remove btn btn-danger btn-sm"=>DEL</button></td>
            </tr>`
        })
        .join("")
        // let removeBtn = document.querySelectorAll("#remove") //it gives array
        AddRemoveBttonEvent()
        }
       
    function AddRemoveBttonEvent(){
        let removeBtn = document.querySelectorAll(".remove")
        removeBtn.forEach((button)=>{
            button.addEventListener("click",()=>{
                let {removeId}= button.dataset
                removeProduct(removeId)
                
            })
        })
    
    }
    async function removeProduct(id){
        let url = `http://localhost:8000/remove-product/${id}`
        let response = await fetch(url,{method:"DELETE"})
        let data = await response.json()
        if(data.status === true){
            getProductDetails()
            
        }
          alert(data.message)    
    }
    

    getProductDetails()  
})