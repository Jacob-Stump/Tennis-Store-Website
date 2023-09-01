package main

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func getTableName(w http.ResponseWriter, r *http.Request) {
	var tableName string

	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "golang",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	defer db.Close()
	err = db.QueryRow("SELECT table_name FROM customer").Scan(&tableName)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprint(w, tableName)

	db.Close()
}

func homePage(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Homepage endpoint hit")
}

func handleRequest() {

	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.HandleFunc("/", homePage)
	myRouter.HandleFunc("/getTableName", getTableName)
	log.Fatal(http.ListenAndServe(":5500", myRouter))
}

func main() {
	//db, err := sql.Open("mysql", "root:Frodobaggins123@tcp(localhost:3306)/golang")

	handleRequest()

}
