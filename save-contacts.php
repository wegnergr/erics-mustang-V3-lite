<?php
    header("Content-Type: application/json; charset=UTF-8");
    $contacts = $_POST["contacts"];
    $myfile = fopen("contacts.json", "w") or die("Unable to open file to write!");

    fwrite($myfile, $contacts);
    fclose($myfile);

    $myfiler = fopen("contacts.json", "r") or die("Unable to open file to read!");
    $obj = fread($myfiler,filesize("contacts.json"));
    fclose($myfiler);

    echo $obj;
?>