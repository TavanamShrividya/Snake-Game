all: report.pdf

IMAGES = ../static/foodImages/Carrot_JE3_BE2.png \
         ../static/foodImages/Golden_Apple_JE2_BE2.png \
         ../static/foodImages/Pumpkin_Pie_JE2_BE2.png \
         ../static/foodImages/Sweet_Berries_JE1_BE1.png \

report.pdf: report.tex refs.bib $(IMAGES)
	pdflatex report.tex
	bibtex report
	pdflatex report.tex
	pdflatex report.tex

.PHONY: clean
clean:
	rm -f *.aux *.log *.bbl *.blg *.toc *.out *.run.xml *.bcf
