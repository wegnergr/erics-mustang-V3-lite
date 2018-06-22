<?php
    print "tfile-response from php**";

$myfile = fopen("newfile.txt", "r") or die("Unable to open file!");
echo fread($myfile,filesize("newfile.txt"));
fclose($myfile);


/*
    $myfile = fopen("newfile01.txt", "w") or die("Unable to open file!");
    $txt = "John Doe01 - EJP\n";
    fwrite($myfile, $txt);
    $txt = "Jane Doe - XYZ\n";
    fwrite($myfile, $txt);
    fclose($myfile);
*/
?>