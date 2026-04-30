all: report.pdf

IMAGES = ../static/BGImages/bookBG.png \
         ../static/BGImages/MainBG.jpg \
         ../static/BGImages/TitleScreenBG.jpg

report.pdf: report.tex refs.bib $(IMAGES)
	pdflatex report.tex
	bibtex report
	pdflatex report.tex
	pdflatex report.tex

.PHONY: clean
clean:
	rm -f *.aux *.log *.bbl *.blg *.toc *.out *.run.xml *.bcf