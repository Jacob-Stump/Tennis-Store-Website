package main

import (
	"database/sql"  //interface for querying/interacting with database
	"encoding/json" //for formatting/encoding/decoding json strings
	"log"           //for logging problems/issues
	"net/http"      //used for http requests/ http.ResponseWriter, *http.Request

	"github.com/go-sql-driver/mysql" //driver for mySQL connection
	"github.com/gorilla/handlers"    //works with net/http package to validate content types, allow access via CORS, compressing http responses
	"github.com/gorilla/mux"         //used to make handling multiple path variables/endpoint connections and related methods
)

type Product struct { //creating JSON object structure for DB retrieval
	ID    int     `json:"product_id"`
	Name  string  `json:"product_name"`
	Desc  string  `json:"descr"`
	Price float32 `json:"price"`
	Img   string  `json:"imgurl"`
}

type Customer struct { //need to restructure customer table/ break address into a seperate table
	ID        int    `json:"customer_id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Phone     int    `json:"phone"`
}

func getProducts(w http.ResponseWriter, r *http.Request) { //func to take in product info from DB and JSONify
	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		panic(err)
	}

	defer db.Close()

	rows, err := db.Query("SELECT product_id, product_name, descr, price, imgurl FROM products")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []Product
	for rows.Next() { //for every row in products table..
		var p Product
		err := rows.Scan(&p.ID, &p.Name, &p.Desc, &p.Price, &p.Img)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}
	//returning the product information as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func handleRequest(corsMiddleware func(http.Handler) http.Handler) { //utilizing mux for handling multiple requests

	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.Use(corsMiddleware)
	myRouter.HandleFunc("/product", getProducts)
	log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {
	//db, err := sql.Open("mysql", "root:Frodobaggins123@tcp(localhost:3306)/golang")

	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	handleRequest(corsMiddleware)

}
